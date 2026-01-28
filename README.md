
# Web-Socket-Chat

Este es un proyecto para crear un chat online usando un web socket, socketIO. Nos permite enviar mensajes y recibir mensajes de otros usuarios, estos mensajes se guardan en la base de datos del servidor, de momento funciona en local, pero esto depende de la configuración que se hagamos.

## Configuración

Para poder empezar a utilizar nuestro chat online tendremos que crear una base de datos y crear un archivo `.env` en la carpeta raíz del proyecto, con esto ya podremos realizar la conexión a la base de datos del servidor. Este es el aspecto que debe tener el archivo `.env`:

```dotenv
PORT=puerto del servidor (5000)

DB_HOST=host de la base de datos (localhost)
DB_USER=usuario con acceso a la base de datos (admin)
DB_PASS=contraseña del usuario (admin)
DB_NAME=nombre de la base de datos (db_chat)
DB_PORT=puerto de la base de datos (3306)
```

Una vez que tengamos realizada la configuración del archivo ```.env``` ya podremos acceder a el chat desde un navegador buscando localhost:5000, cambiando el puerto por el del servidor que hayamos configurado en el archivo ```.env```.
