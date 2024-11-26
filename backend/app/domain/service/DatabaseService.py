import psycopg2

class Database:
    """
    Classe para interagir com o banco de dados PostgreSQL e retornar informações de databases, schemas e tabelas.
    """

    def __init__(self, host, port, user, password, name=None):
        """
        Inicializa a conexão com o banco de dados PostgreSQL.

        Args:
            host (str): Endereço do servidor PostgreSQL.
            port (int): Porta do servidor PostgreSQL.
            user (str): Usuário do banco de dados.
            password (str): Senha do banco de dados.
            name (str): Nome do banco de dados.
        """
        self.host = host
        self.port = port
        self.user = user
        self.password = password
        self.name = name

    def _connect(self, dbname=None):
        """
        Estabelece uma conexão com o banco de dados PostgreSQL.
        
        Returns:
            connection: Conexão ao banco de dados PostgreSQL.
        """
        return psycopg2.connect(
            host=self.host,
            port=self.port,
            user=self.user,
            password=self.password,
            dbname=dbname or self.name
        )

    def get_databases(self):
        """
        Retorna a lista de databases no servidor PostgreSQL.

        Returns:
            list: Lista de nomes das databases.
        """
        connection = self._connect()
        cursor = connection.cursor()
        cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false and datname != 'postgres';")
        databases = [row[0] for row in cursor.fetchall()]
        cursor.close()
        connection.close()
        return databases

    def get_schemas(self, dbname: str):
        """
        Retorna a lista de schemas na database especificada por `dbname`.
        """
        try:
            connection = self._connect(dbname)
            cursor = connection.cursor()
            cursor.execute("""
                SELECT schema_name 
                FROM information_schema.schemata
                WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast');
            """)
            schemas = [row[0] for row in cursor.fetchall()]
            print(f"Schemas encontrados: {schemas}")
            cursor.close()
            connection.close()
            return schemas
        except Exception as e:
            print(f"Erro ao obter schemas: {e}")
            raise

    def get_tables(self, db_name, schema):
        """
        Retorna a lista de tabelas no schema especificado dentro da database configurada.

        Args:
            schema (str): Nome do schema para listar as tabelas.

        Returns:
            list: Lista de nomes das tabelas.
        """
        connection = self._connect(db_name)
        cursor = connection.cursor()
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = %s;", (schema,))
        tables = [row[0] for row in cursor.fetchall()]
        print(tables)
        cursor.close()
        connection.close()
        return tables