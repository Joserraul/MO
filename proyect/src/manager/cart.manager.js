import fs from 'fs/promises';
import path from 'path';

class CartManager {
  constructor(filePath, productManager) {
    this.path = path.resolve(filePath);
    this.carts = [];
    this.productManager = productManager;
    this.init();
  }

  init = async () => {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.carts = JSON.parse(data || '[]');
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.carts = [];
        await this.saveCarts();
      } else {
        throw error;
      }
      }
    }

  createCart = async () => {
    try {
      const lastId = this.carts.length > 0 ? this.carts[this.carts.length - 1].id : 0;

      const newCart = {
        id: lastId + 1,
        products: [],
      };
      this.carts.push(newCart);
      await this.saveCarts();
      return newCart;

    } catch (error) {
      console.error("Error al crear el carrito en Form Courier:", error);
      throw new Error("No se pudo crear el carrito correctamente.");
    }
  };

  listCarts = async () => {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al listar los carritos en Form Courier:", error);
      throw new Error("No se pudieron listar los carritos correctamente.");
    }
  };

  addProductToCart = async (cartId, productId) => {
    try { 
      const products = await this.productManager.listProducts();

      if (products.stock <= 0) {
        throw new Error("El producto no tiene stock disponible.");
      }

      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error("El carrito especificado no existe.");
      }

      const productIndex = products.findIndex((product) => product.id === productId);
      if (productIndex === -1) {
        const newAmount = this.carts[cartIndex].products[productIndex].amount + 1;
        if (products.stock < newAmount) {
          throw new Error("No hay suficiente stock para agregar más unidades de este producto al carrito.");
        }
        this.carts[cartIndex].products[productIndex].amount += 1;
      } else {
        this.carts[cartIndex].products.push({
          id: productId,
          amount: 1
        });
      }

      await this.saveCarts();
      return this.carts[cartIndex];
    } catch (error) {
      console.error("Error al agregar el producto al carrito en Form Courier:", error);
    }
      };

  checkout = async (cartId) => {
    try {
      const cartIndex = this.carts.findIndex((cart) => cart.id === cartId);
      if (cartIndex === -1) {
        throw new Error("El carrito especificado no existe.");
      }
      const cart = this.carts[cartIndex];
      let totalPrice = 0;
      for (const product of cart.products) {
        const productInfo = await this.productManager.getProduct(product.id);
        totalPrice += productInfo.price * product.amount;
      }
      cart.products = [];
      await this.saveCarts();
      return {
        cart,
        totalPrice,
      };
    } catch (error) {
      console.error("Error al realizar el checkout en Form Courier:", error);
      throw new Error("No se pudo realizar el checkout correctamente.");
    }
  }

}

export const cartManager = new CartManager('../data/carts.json', null);