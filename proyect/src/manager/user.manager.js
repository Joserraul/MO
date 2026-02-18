import fs from 'fs';
import crypto from 'crypto';



/**
 * @UserManager - Clase para gestionar usuarios, incluyendo registro, inicio de sesión, actualización y eliminación.
 * @getUsers - Método para obtener todos los usuarios desde un archivo JSON.
 * @getUserById - Método para obtener un usuario por su ID.
 * @register - Método para registrar un nuevo usuario, asegurando que el email no esté registrado y almacenando la contraseña de forma segura.
 * @login - Método para iniciar sesión de un usuario, verificando el email y la contraseña.
 * @updateUser - Método para actualizar la información de un usuario existente.
 * @deleteUser - Método para eliminar un usuario por su ID.
 */
class UserManager {
    constructor(path) {
        this.path = path;
    }

    getUsers = async () => {
        if (fs.existsSync(this.path)) {
            const user = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(user);
        }
        return [];
    };

    getUserById = async (id) => {
        try {
            const user = await this.getUsers();
            const userFound = user.find((u) => u.id === id);
            return userFound;
        } catch (error) {
            console.error('Error al obtener el usuario por ID:', error);
        }
    };


    register = async (obj) => {
      try {
        const user = {...obj };
        const users = await this.getUsers();
        if (users.some((u) => u.email === user.email)) {
          throw new Error('El email ya está registrado');
        }
        user.secret = crypto.randomBytes(128).toString('hex');
        user.password = crypto.createHash('sha256').update(user.password).digest('hex');
        users.push(user);
        await fs.promises.writeFile(this.path, JSON.stringify(users));
        return {user: user.email + ' registrado exitosamente'};

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        }
      };



    loginUser = async (email, password) => {
        try {
          const users = await this.getUsers();
          const user = users.find((u) => u.email === email);
          if (!user) {
            throw new Error('El email no está registrado');
          }
          const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
          if (user.password !== hashedPassword) {
            throw new Error('La contraseña es incorrecta');
          }
          return user;
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
        }
      };



      updateUser = async (id, obj) => {
        try {
          const users = await this.getUsers();
          let userindex = await this.getUserById(id);
          if (!userindex) {
            throw new Error('Usuario no encontrado');
          }
          userindex = users.findIndex((u) => u.id === id);
          users[userindex] = {...users[userindex], ...obj};
          await fs.promises.writeFile(this.path, JSON.stringify(users));
          return users[userindex];
        } catch (error) {
          console.error('Error al actualizar el usuario:', error);
        }
      };



      deleteUser = async (id) => {
        try {
          const users = await this.getUsers();
          const userindex = await this.getUserById(id);
          if (!userindex) {
            throw new Error('Usuario no encontrado');
          }
          const updatedUsers = users.filter((u) => u.id !== id);
          await fs.promises.writeFile(this.path, JSON.stringify(updatedUsers));
          return userindex;  
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
        }
          }
}

export const userManager = new UserManager('../data/users.json');