const keyVaultName = process.env["KEY_VAULT_NAME"];
const KVUri = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const client = new SecretClient(KVUri, credential);