// backend/server.js
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', (qr) => {
    console.log('ESCANEA ESTE QR CON EL WHATSAPP DE LA TIENDA:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    // Ya quitamos la búsqueda de grupos, así que esto cargará rapidísimo
    console.log('✅ ¡Bot de WhatsApp conectado y listo!');
});

client.initialize();

app.post('/api/orden', async (req, res) => {
    const { mensaje } = req.body;
    if (!mensaje) return res.status(400).json({ error: 'El mensaje está vacío' });

    try {
        // Tu ID real del grupo "Pedidos-Tienda"
        const numeroDestino = '120363408646977973@g.us'; 
        
        await client.sendMessage(numeroDestino, mensaje);
        console.log('✅ Pedido enviado exitosamente al grupo familiar');
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Error al enviar mensaje:', error);
        res.status(500).json({ error: 'Fallo al enviar mensaje' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});