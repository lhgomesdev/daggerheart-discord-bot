// events/ready.js
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Bot ${client.user.tag} está online e pronto!`);
    },
};