# Payload Workers Template

A template for deploying Payload CMS on Cloudflare Workers with D1 database and R2 storage.

## Features
This template comes pre-configured with:

- Granular Permissions - Fine-grained access control for collections and fields
- Cloudflare D1 Integration - Serverless SQL database for your content
- R2 Storage - Object storage for media and file uploads
- Edge Deployment - Deploy globally on Cloudflare's edge network
- TypeScript Support - Fully typed for better developer experience
- Production Ready - Pre-configured with best practices and optimizations

## Prerequisites

- [pnpm](https://pnpm.io/) installed
- Cloudflare account
- Git installed

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/gunnarsaliev/payload-workers-template.git
cd payload-workers-template
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Git Remotes

Add the template repository as a remote (useful for pulling future updates):

```bash
git remote add template https://github.com/gunnarsaliev/payload-workers-template.git
```

Set your own repository as the origin:

```bash
git remote set-url origin {{your-new-repo-url}}
```

Verify the changes:

```bash
git push
```

## Cloudflare Setup

### 1. Create D1 Database and R2 Bucket

In your Cloudflare dashboard:
- Create a new D1 database
- Create a new R2 bucket

### 2. Update Configuration

Edit the `wrangler.jsonc` file and replace:
- Database name and D1 ID with your newly created D1 database details
- R2 bucket name
- Worker name to your desired worker name

### 3. Commit Your Changes

```bash
git add .
git commit -m "Update Cloudflare configuration"
git push
```

## Deployment

### 1. Create Cloudflare Workers Application

1. Go to your Cloudflare dashboard
2. Navigate to **Workers & Pages** > **Create application**
3. Choose **"Import a repository"** and select your project repository

### 2. Configure Build Settings

Set the following build and deploy settings:

- **Build command**: `pnpm run deploy:database`
- **Deploy command**: `pnpm run deploy:app`

### 3. Deploy

Run your first deployment through the Cloudflare dashboard.

### 4. Configure Secrets

Add your Payload secret token to Cloudflare Worker:

1. Go to your worker's settings
2. Navigate to **Variables and Secrets**
3. Add your `PAYLOAD_SECRET` token

**Tip**: You can generate a secure secret using `openssl rand -base64 32` or visit [generate-secret.vercel.app](https://generate-secret.vercel.app/)

## Success! 🎉

Congratulations! Your Cloudflare Workers app is ready to go!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the [GitHub repository](https://github.com/gunnarsaliev/payload-workers-template/issues).
