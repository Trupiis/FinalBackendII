import cartService from '../services/cart.service.js';
import productService from '../services/product.service.js';
import ticketService from '../services/ticket.service.js';
import TicketDTO from '../dtos/ticket.dto.js';


export const createCart = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en createCart:", req.body);

        const selectedProducts = req.body?.selectedProducts || [];


        let productsWithQuantities = [];

        if (selectedProducts && selectedProducts.length > 0) {
            const productIds = Array.isArray(selectedProducts) ? selectedProducts : [selectedProducts];
            productsWithQuantities = productIds.map(productId => ({
                product: productId,
                quantity: Number(req.body[`quantity_${productId}`]) || 1
            }));
        }


        console.log("🛒 Productos que se guardarán en el carrito:", productsWithQuantities);


        const newCart = await cartService.createCart({ products: productsWithQuantities });

        req.session.cartId = newCart._id;
        console.log("✅ Carrito creado con ID:", newCart._id);

        res.status(201).json({ status: 'success', message: 'Carrito creado', cartId: newCart._id });
    } catch (error) {
        console.error("❌ Error al crear el carrito:", error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const addProductSessionCart = async (req, res) => {
    try {
        console.log("📥 Datos recibidos en addProductSessionCart:", req.body);

        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            console.error("❌ Error: Faltan datos o datos inválidos");
            return res.status(400).json({ status: "error", message: "Faltan datos" });
        }

        let cart;
        cart = await cartService.getCartById(req.session.cartId);
        if (!cart) {
            console.log("🛒 No existe carrito en la sesión. Creando uno nuevo...");
            cart = await cartService.createCart({ products: [] });
            req.session.cartId = cart._id;
            console.log("✅ Nuevo carrito creado:", cart._id);
        }


        const product = await productService.getProductById(productId); 
        if (!product) {
            console.error("❌ Error: Producto no encontrado con ID:", productId);
            return res.status(404).json({ status: "error", message: "Producto no encontrado" }); 
        }

        cart.products.push({ product: product._id, quantity: Number(quantity) });

        const updatedCart = await cartService.updateCart(cart._id, cart.products);
        if (!updatedCart) {
            console.error(`❌ Error en addProductSessionCart: No se pudo actualizar el carrito ${cart._id} en la BD`);
            return res.status(500).json({ status: "error", message: "Error interno al actualizar el carrito" });
        }

        console.log(`✅ Producto ${productId} (x${quantity}) agregado al carrito ${cart._id} y guardado.`);

        res.json({ status: "success", message: "Producto agregado al carrito de sesión", cartId: cart._id });

    } catch (error) {
        console.error("❌ Error al agregar productos:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
}; 

export const getCartById = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.cid);

        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        const cart = await cartService.addProductToCart(cid, pid, quantity);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ status: "error", message: "Formato inválido de productos" });
        }

        const updatedCart = await cartService.updateCart(cid, products);

        if (!updatedCart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", cart: updatedCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};


export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        let { quantity } = req.body;

        quantity = parseInt(quantity);
        if (isNaN(quantity) || quantity < 1) {
            return res.status(400).json({ status: "error", message: "Cantidad no válida" });
        }

        const cart = await cartService.updateProductQuantity(cid, pid, quantity);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", cart });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartService.deleteProductFromCart(cid, pid);
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        res.json({ message: "Producto eliminado del carrito", cart });
    } catch (error) {
        res.status(500).json({ message: "Error en el servidor", error });
    }
};


export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartService.deleteCart(cid);
        if (!cart) {
            return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        }

        res.json({ status: "success", message: "Carrito vaciado correctamente" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const userEmail = req.user.email; 

        console.log(`\n\n🛒 Iniciando proceso de compra para carrito ${cid} por usuario ${userEmail}`);
        console.log("req.params:", req.params);
        console.log("req.user:", req.user);

        const cart = await cartService.getCartById(cid);

        if (!cart) {
            console.log(`❌ Carrito ${cid} no encontrado.`);
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        if (cart.products.length === 0) {
            console.log(`⚠ Carrito ${cid} está vacío.`);
            return res.status(400).json({ status: 'error', message: 'El carrito está vacío' });
        }

        let totalAmount = 0;
        const productsToPurchase = [];
        const productsNotPurchasedIds = [];

        console.log(`🔍 Verificando stock para ${cart.products.length} items en carrito ${cid}...`);
        for (const item of cart.products) {
            const productId = item.product._id
            const quantityInCart = item.quantity;

            try {
                const productData = await productService.getProductById(productId); 

                if (!productData) {
                    console.log(`⚠ Producto ${productId} no encontrado en la base de datos. Omitiendo.`);
                    productsNotPurchasedIds.push(productId);
                    continue;d
                }

                if (productData.stock >= quantityInCart) {
                    console.log(`✅ Stock suficiente para ${productData.title} (ID: ${productId}). Stock: ${productData.stock}, Cantidad: ${quantityInCart}`);
                    productsToPurchase.push({
                        product: productId,
                        quantity: quantityInCart,
                        price: productData.price
                    });
                    totalAmount += productData.price * quantityInCart;
                } else {
                    console.log(`❌ Stock insuficiente para ${productData.title} (ID: ${productId}). Stock: ${productData.stock}, Cantidad: ${quantityInCart}`);
                    productsNotPurchasedIds.push(productId);
                }
            } catch (productError) {
                console.error(`❌ Error al procesar producto ${productId}:`, productError);
                productsNotPurchasedIds.push(productId);
            }
        }
        console.log(`📊 Verificación de stock completa. ${productsToPurchase.length} items con stock. ${productsNotPurchasedIds.length} items sin stock.`);

        let newTicket = null;
        if (productsToPurchase.length > 0) {
            console.log(`💸 Procesando compra por un total de ${totalAmount}...`);
            for (const item of productsToPurchase) {
                try {
                    await productService.updateProductStock(item.product, -item.quantity);
                    console.log(`📉 Stock actualizado para producto ${item.product}.`);
                } catch (stockError) {

                    console.error(`🔥 Error CRÍTICO al actualizar stock para ${item.product}:`, stockError);
                    productsNotPurchasedIds.push(item.product);
                }
            }

            const code = Math.random().toString(36).substring(2, 10).toUpperCase(); 

            const ticketData = {
                code: Math.random().toString(36).substring(2, 10).toUpperCase(),
                buy_datetime: new Date(),
                amount: totalAmount,
                buyer: userEmail,
                products: productsToPurchase.map(item => ({   
                    product: item.product,
                    quantity: item.quantity
                }))
            };
            try {
                newTicket = await ticketService.createTicket(ticketData);
                console.log(`🎫 Ticket creado con éxito: ${newTicket.code}`);

                if (newTicket && req.user && req.user.email) {
                    try {
                        await sendPurchaseEmail(req.user.email, newTicket);
                        console.log(`📧 Correo de confirmación de compra enviado a ${req.user.email}.`);
                    } catch (emailError) {
                        console.error(`❌ Error al enviar correo de confirmación a ${req.user.email}:`, emailError);
                        // No detener la compra por error de email, solo loguear
                    }
                } else {
                    console.log("📧 No se pudo enviar el correo: falta ticket, usuario o email del usuario.");
                }

            } catch (ticketError) {
                console.error(`❌ Error al crear el ticket:`, ticketError);
                // Aquí también se necesita manejo de errores. Si el ticket no se crea, ¿qué pasa con el stock?
                return res.status(500).json({ status: 'error', message: 'Error al generar el ticket de compra' });
            }

            // 3. Actualizar carrito: Dejar solo los productos no comprados
            console.log(`🧹 Actualizando carrito ${cid} para remover productos comprados...`);
            try {
                const remainingProducts = cart.products.filter(item => productsNotPurchasedIds.includes(item.product._id));
                await cartService.updateCart(cid, remainingProducts.map(p => ({ product: p.product._id, quantity: p.quantity }))); // Guardar solo IDs y cantidad
                console.log(`🛒 Carrito ${cid} actualizado. Quedan ${remainingProducts.length} items.`);
            } catch (cartUpdateError) {
                console.error(`⚠️ Error al actualizar el carrito ${cid} después de la compra:`, cartUpdateError);
                
            }

        } else {
            console.log(`🤷 No hay productos con stock suficiente en el carrito ${cid}. No se generará ticket.`);
        }

        // 4. Devolver respuesta
        console.log(`✅ Proceso de compra para carrito ${cid} finalizado.`);
        res.status(200).json({
            status: 'success',
            message: productsToPurchase.length > 0 ? 'Compra procesada' : 'No se pudieron comprar productos por falta de stock',
            ticket: newTicket ? new TicketDTO(newTicket) : null, // Usar TicketDTO si el ticket se creó
            productsNotPurchased: productsNotPurchasedIds 
        });

    } catch (ticketError) {
        console.error(`❌ Error al crear el ticket:`, ticketError, "Datos del ticket:", ticketData);
        return res.status(500).json({ status: 'error', message: 'Error al generar el ticket de compra' });
}

};


export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.json({ status: "success", carts });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};