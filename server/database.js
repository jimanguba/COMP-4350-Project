const Pool = require("pg").Pool;
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const bookUtil = require('./book');
const fs = require('fs');
const { boolean } = require("yargs");

const vaultUri = `https://${process.env.VAULTNAME}.vault.azure.net/`;

let vaultSecretsMap = {}

let pool = new Pool({
  user: 'postgres',
  password: 'ferrets',
  host: 'localhost',
  port: 5432,
  database: 'bookshelf'
});

const getKeyVaultSecrets = async () => {
  // Create a key vault secret client
  console.log("Key vault secrets called")
  let secretClient = new SecretClient(vaultUri, new DefaultAzureCredential());
    try {
      // Iterate through each secret in the vault
      listPropertiesOfSecrets = secretClient.listPropertiesOfSecrets();
      for await (let secretProperties of secretClient.listPropertiesOfSecrets()) {
        // Only load enabled secrets - getSecret will return an error for disabled secrets
        if (secretProperties.enabled) {
          const secret = await secretClient.getSecret(secretProperties.name);
          vaultSecretsMap[secretProperties.name] = secret.value;
        }
      }
    } catch(err) {
      console.log(err.message)
    }
}

const connectToDatabase = async () => {
    await getKeyVaultSecrets()
    pool = new Pool({
        user: 'postgres',
        password: 'ferrets',
        host: 'localhost',
        port: 5432,
        database: 'bookshelf'
    });

    connectionType = 'Local'

    if(process.env.PG_CONN_STRING || process.env.PG_CONN_STRING_FILE) {
        connString = process.env.PG_CONN_STRING
        if(process.env.PG_CONN_STRING_FILE) {
          connString = fs.readFileSync(process.env.PG_CONN_STRING_FILE, 'utf8')
        }
        pool = new Pool({
            connectionString: connString
        })
        connectionType = 'Azure database via connection string'
    }

    if(process.env.DBVAULTSTRING in vaultSecretsMap) {
        pool = new Pool({
            connectionString: vaultSecretsMap[process.env.DBVAULTSTRING]
        })
        connectionType = 'Azure database via key vault secret'
    }

    console.log(`Connection type: ${connectionType}`)
}


module.exports = {
    query: (text, params) => pool.query(text, params)
  };

function getAllBooks(params) {
    return pool.query('SELECT * FROM books', params)
}

async function getBook(identifier) {
    try {
      const queryResult = await pool.query('SELECT * FROM books WHERE book_id = $1', [identifier]);
      const bookData = queryResult?.rowCount > 0 ? queryResult.rows[0] : undefined;
      return bookUtil.validateBook(bookData) ? bookData : undefined;
    } catch (error) {
      console.error('Error fetching book:', error);
      throw error;
    }
  }
  

function insertBook(newBook) {
    return bookUtil.validateBook(newBook) ?
    pool.query(
        `INSERT INTO books(title, author, pages, genre)
        SELECT $1, $2, $3, $4 
        WHERE NOT EXISTS (
            SELECT title,author FROM books 
                WHERE title=$5
                AND author=$6)`
        , [newBook.title, newBook.author, newBook.pages, newBook.genre, newBook.title, newBook.author]
    ) : false
}

async function updateBook(book) {
    try {
        const queryResult = await pool.query(`UPDATE books SET title=$1, author=$2, pages=$3, genre=$4 WHERE book_id=$5`, [book.title, book.author, book.pages, book.genre, book.book_id])
        return queryResult.rowCount > 0;
    } catch (error) {
        console.error('Error updating book:', error);
        throw error;
    }
}

module.exports = {
    query: (text, params) => pool.query(text, params),
    getAllBooks,
    getBook,
    insertBook,
    updateBook,
    connectToDatabase
  };
