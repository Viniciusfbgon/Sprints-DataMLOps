# Configurações
BACKUP_DIR="/tmp/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.sql"

# Variáveis do banco
DB_HOST="db"
DB_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="mysecretpassword"
DB_NAME="postgres"

# Criar diretório
mkdir -p $BACKUP_DIR

# Fazer backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compactar
gzip $BACKUP_FILE

# Enviar para Cloud Storage
echo "$GCP_SERVICE_ACCOUNT_KEY" > /tmp/key.json
gcloud auth activate-service-account --key-file /tmp/key.json
gsutil cp ${BACKUP_FILE}.gz gs://$GCP_BUCKET_NAME/backups/

# Limpar arquivo local
rm ${BACKUP_FILE}.gz