# MongoDB Atlas Setup Guide

## Quick Setup Steps

### 1. Create MongoDB Atlas Account
- Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
- Sign up for a free account or sign in

### 2. Create a New Cluster
- Click "Create a New Cluster"
- Choose the free tier (M0 Sandbox)
- Select your preferred cloud provider and region
- Click "Create Cluster" (this may take a few minutes)

### 3. Create Database User
- Go to "Database Access" in the left sidebar
- Click "Add New Database User"
- Choose "Password" authentication
- Set username and password (remember these!)
- Set privileges to "Read and write to any database"
- Click "Add User"

### 4. Configure Network Access
- Go to "Network Access" in the left sidebar
- Click "Add IP Address"
- For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
- For production, add your specific IP address
- Click "Confirm"

### 5. Get Connection String
- Go to "Clusters" and click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string (should look like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`)

### 6. Update Environment File
- Open your `.env` file in the project root
- Replace the MONGO_URI with your actual connection string:
```
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/railway_dashboard?retryWrites=true&w=majority
```

### 7. Restart the Server
```bash
npm run server
```

## Example Connection String
```
mongodb+srv://railwayuser:securepassword123@cluster0.ab1cd.mongodb.net/railway_dashboard?retryWrites=true&w=majority
```

## Troubleshooting

### Common Issues:
1. **Connection timeout**: Check network access settings
2. **Authentication failed**: Verify username/password
3. **Database name**: Make sure database name is included in the URI

### Security Best Practices:
- Use strong passwords for database users
- Restrict network access to specific IP addresses in production
- Use environment variables for sensitive data
- Regularly rotate database passwords

## Testing the Connection
Once configured, you should see:
```
✅ MongoDB connected successfully
🔗 Connected to: MongoDB Atlas
```

If you see connection errors, double-check your credentials and network settings.