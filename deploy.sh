#!/bin/bash

# Exit on any error
set -e

export AWS_DEFAULT_PROFILE=dev.tirwin.fe
# Configuration

set -o allexport
source .env.development
set +o allexport


DIST_FOLDER="dist/browser"

# Function to check AWS CLI is installed and configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        echo "Error: AWS CLI is not installed. Please install it first."
        exit 1
    fi

    # Check if AWS credentials are configured
    if ! aws sts get-caller-identity &> /dev/null; then
        echo "Error: AWS credentials not configured. Please run 'aws configure' first."
        exit 1
    fi
}

# Function to check if S3 bucket exists
check_s3_bucket() {
    if ! aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
        echo "Error: S3 bucket '$S3_BUCKET' does not exist or you don't have access to it."
        exit 1
    fi
}

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

# Check prerequisites
echo "Checking prerequisites..."
check_aws_cli
check_s3_bucket

# Build the Angular application
echo "Building the application..."
ng build --configuration=production || handle_error "Angular build failed"

# Check if dist folder exists
if [ ! -d "$DIST_FOLDER" ]; then
    handle_error "Build folder '$DIST_FOLDER' not found"
fi

echo "Build successful. Deploying to S3..."

# Sync the dist folder with S3 bucket
echo "Uploading files to S3..."
if ! aws s3 sync $DIST_FOLDER/ s3://$S3_BUCKET/ --delete --exclude "assets/*" --exclude "media/*"; then
    handle_error "Failed to sync files with S3 bucket"
fi

# Set proper cache control headers
echo "Setting cache control headers..."
if ! aws s3 cp s3://$S3_BUCKET/ s3://$S3_BUCKET/ \
    --content-type text/html \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control max-age=31536000,public \
    --exclude "index.html" --exclude "assets/*" --exclude "media/*"; then
    handle_error "Failed to set cache control headers for static assets"
fi

# Set no-cache for index.html
echo "Setting cache control for index.html..."
if ! aws s3 cp s3://$S3_BUCKET/index.html s3://$S3_BUCKET/index.html \
    --content-type text/html \
    --metadata-directive REPLACE \
    --cache-control no-cache,no-store,must-revalidate \
    --exclude "assets/*" --exclude "media/*"; then
    handle_error "Failed to set cache control for index.html"
fi

# Create CloudFront invalidation
echo "Creating CloudFront invalidation..."
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ] && [ "$CLOUDFRONT_DISTRIBUTION_ID" != "YOUR_CLOUDFRONT_DISTRIBUTION_ID" ]; then
   if ! aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*"; then
       handle_error "Failed to create CloudFront invalidation"
    fi
    echo "CloudFront invalidation created successfully"
else
    echo "Warning: CloudFront distribution ID not set. Skipping cache invalidation."
fi

echo "Deployment complete!"
echo "S3 Website URL: http://$S3_BUCKET.s3-website-us-east-1.amazonaws.com"
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ] && [ "$CLOUDFRONT_DISTRIBUTION_ID" != "YOUR_CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "Please allow 5-10 minutes for CloudFront cache invalidation to complete."
fi 