import { Server } from './infrastructure/server';

async function main() {
    await Server.bootstrap();
}

main();
