import path from 'path';
import fs from 'fs';

class ProductManager {
    constructor(filePath) {
        this.path = path.resolve(filePath);
        this.products = [];
        this.init();
    }

    init = async () => {
      try {
        await fs.promises.access(this.path);
        const data = await fs.readFile(this.path, 'utf-8');
        if (data.trim() !== '') {
          this.products = [];
          await this.saveProducts();
          } else this.products = JSON.parse(data);
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.products = [];
          await this.saveProducts();
      }  else {
          console.error('Error al inicializar ProductManager:', error);
      }
    }
    }


    saveProducts = async () => {
        try {
            await fs.mkdir(path.dirname(this.path), { recursive: true });
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    addProduct = async (product) => {
        try {
            const newProduct = {
                id: this.products.length + 1,
                ...product,
            };
            this.products.push(newProduct);
            await this.saveProducts();
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    }

    listProducts = async () => {
        try {
          const data = await fs.promises.readFile(this.path, 'utf-8');
          const products = JSON.parse(data || '[]');
          this.products = products.map((product) => ({
            ...product,
            id: product.id,
            timestamp: new Date(product.timestamp).toLocaleString(),
          }))
          return this.products;
        } catch (error) {
          console.error('Error al listar productos:', error);
        }
      }

      getProduct = async (id) => {
        try {
          if (this.products.length === 0) {
            await this.listProducts();
          }
          const product = this.products.find((p) => p.id === id);
          return product;
      } catch (error) {
          console.error('Error al obtener producto por ID:', error);
      }
    }

    updateProduct = async (id, updatedFields) => {
        try {
          if (this.products.length === 0) {
            await this.listProducts();
          }
          const productIndex = this.products.findIndex((p) => p.id === id);
          if (productIndex === -1) {
            throw new Error('Producto no encontrado');
          }
          this.products[productIndex] = {
            ...this.products[productIndex],
            ...updatedFields,
          };
          await this.saveProducts();
        } catch (error) {
          console.error('Error al actualizar producto:', error);
        }
      }

      deleteProduct = async (id) => {
        try {
          if (this.products.length === 0) {
            await this.listProducts();
          }
          const productIndex = this.products.findIndex((p) => p.id === id);
          if (productIndex === -1) {
            throw new Error('Producto no encontrado');
          }
          this.products.splice(productIndex, 1);
          await this.saveProducts();
        } catch (error) {
          console.error('Error al eliminar producto:', error);
        }
      }
  }

  export const productManager = new ProductManager('../data/products.json');