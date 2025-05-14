# UTech Housing - Netlify Deployment Guide

This guide provides step-by-step instructions for deploying the UTech Housing application to Netlify.

## Prerequisites

- Node.js (v18+ recommended)
- npm (v8+ recommended)
- Git
- GitHub account
- Netlify account (free tier available)

## Local Setup

1. Clone the repository and navigate to your project directory:
   ```
   git clone <your-repository-url>
   cd utech-housing
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Build the project locally to verify everything works:
   ```
   npm run build
   ```

## Netlify Configuration

### 1. Create a netlify.toml File

Create a `netlify.toml` file in the root of your project with the following content:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NETLIFY_NEXT_PLUGIN_SKIP = "true"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

This configuration tells Netlify:
- How to build your project
- Where the built files are located
- To use the Next.js plugin for optimal deployment
- How to handle client-side routing

### 2. Push Configuration to GitHub

Commit and push the configuration file to your GitHub repository:

```
git add netlify.toml
git commit -m "Add Netlify configuration"
git push
```

## Deployment Process

### 1. Sign Up/Log In to Netlify

- Go to [app.netlify.com](https://app.netlify.com/)
- Sign up or log in with your GitHub account or email

### 2. Import Your Project

1. Click "Add new site" > "Import an existing project"
2. Select GitHub as your Git provider
3. Authorize Netlify to access your GitHub repositories
4. Select your UTech Housing repository

### 3. Configure Build Settings

Netlify should automatically detect your Next.js project, but verify these settings:

- Build command: `npm run build`
- Publish directory: `.next`

The `netlify.toml` file will override these settings if needed.

### 4. Deploy Your Site

- Click "Deploy site"
- Netlify will build and deploy your site
- You'll receive a temporary URL like `random-name.netlify.app`

### 5. Set Up a Custom Domain (Optional)

1. In your site dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow the steps to configure DNS settings

## Environment Variables

If your application uses environment variables:

1. Go to Site settings > Build & deploy > Environment
2. Click "Edit variables"
3. Add each environment variable:
   - Key: Your environment variable name (e.g., `NEXT_PUBLIC_API_URL`)
   - Value: The corresponding value

## Continuous Deployment

After setup, any push to your main branch will automatically trigger a new build and deployment.

To change this behavior:
1. Go to Site settings > Build & deploy > Continuous Deployment
2. Configure deploy contexts or create branch deploy settings

## Additional Netlify Features

### Forms

For contact forms, add the `netlify` attribute to your form element:

```html
<form name="contact" netlify>
  <!-- form fields -->
</form>
```

### Serverless Functions

Create serverless functions in the `netlify/functions` directory:

```
netlify/functions/hello-world.js
```

### Authentication

Use Netlify Identity for user authentication:
1. Go to Site settings > Identity
2. Click "Enable Identity"

## Troubleshooting

### Build Failures

- Check build logs in the Netlify dashboard
- Ensure all dependencies are properly installed
- Verify your Next.js version is compatible with the Netlify Next.js plugin

### Routing Issues

- Check the redirects in your `netlify.toml` file
- Ensure client-side routing is properly configured

### Environment Variables

- Make sure all required environment variables are set
- For client-side variables, prefix with `NEXT_PUBLIC_`

## Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/overview/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)

## Support

If you encounter issues not covered in this guide:
- Check the [Netlify Community](https://community.netlify.com/)
- Review [Netlify Support](https://www.netlify.com/support/)
- File an issue in the project repository 