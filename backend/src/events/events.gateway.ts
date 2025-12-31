import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  // notifica quantas inscrições estão disponíveis
  notifyTournamentUpdate(
    tournamentId: number,
    currentPlayers: number,
    maxPlayers: number,
  ) {
    const payload = {
      tournamentId,
      currentPlayers,
      maxPlayers,
      isFull: currentPlayers >= maxPlayers,
      timestamp: new Date(),
    };

    this.server.emit('tournament_status', payload);
    console.log(
      `WS enviado: Torneio ${tournamentId} tem ${currentPlayers}/${maxPlayers} inscritos`,
    );
  }

  notifyMatchUpdate(matchId: number, winnerId: number) {
    const payload = {
      matchId,
      winnerId,
      status: 'finished',
      timestamp: new Date(),
    };

    this.server.emit('match_status', payload);
    console.log(
      `WS enviado: Partida ${matchId} finalizada. O vencedor foi ${winnerId}`,
    );
  }

  afterInit(server: Server) {
    console.log('Websocket Gateway iniciado!');
  }

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
}
