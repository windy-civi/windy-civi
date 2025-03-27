# OpenStates Bulk Data Import Guide

## Description
This guide provides instructions for importing OpenStates bulk data into a local PostgreSQL database using pgAdmin 4 and CLI tools.

**Note**: These instructions are specifically for Windows 10 machines and implies pgAdmin4 is already installed.

## Requirements
- pgAdmin 4
- PostgreSQL
- Significant storage space (current PostgreSQL directory: ~35GB)

### Verifying Installation
1. Check the PostgreSQL `bin` directory to verify presence of `pg_restore` and `psql` for CLI work 
2. Ensure path is added to environment variables

**Default bin path**: `C:\Program Files\PostgreSQL\17\bin`

## Import Process

### Step 1: Import Schema
#### PowerShell Command
```powershell
pg_restore ` -U postgres ` -d postgres ` -v ` -h localhost ` -c ` -s ` */path/to/schema.dumpfile*
```

#### Bash Command
```bash
pg_restore -U postgres -d your_database_name */path/to/schema.dumpfile*
```

### Step 2: Import Data
**Note**: This step may take considerable time.

#### PowerShell Command
```powershell
pg_restore ` -U postgres ` -d postgres ` -v ` -h localhost ` -a ` */path/to/data.dumpfile*
```

#### Bash Command
```bash
pg_restore -U postgres -d your_database_name */path/to/data.dumpfile*
```

## Troubleshooting Tips
- Refresh the server if changes are not immediately visible
- Performance considerations:
  - First attempt (4+ hours): Used pgAdmin 4 on HDD
  - Successful attempt (<1 hour): CLI commands on SSD with single partition

### Performance Recommendations
- Use an SSD for faster imports
- Prefer CLI commands over pgAdmin import for large datasets
- Ensure sufficient system resources are available

## Additional Resources
- [pgAdmin 4 Documentation](https://www.pgadmin.org/docs/)

## Best Practices
- Ensure adequate free disk space before starting
- Monitor system resources during import
- Consider scheduling imports during low-activity periods

**Tip**: Replace `*usrname*` and file paths with your specific details.