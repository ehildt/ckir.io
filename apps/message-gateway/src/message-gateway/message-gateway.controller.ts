import { Body, Controller, HttpCode, HttpStatus, ParseEnumPipe, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MessageMode } from './constants/message-req.constants';
import { MessageReq } from './dtos/message-req.dto';
import { MessageGatewayService } from './message-gateway.service';

const REQUEST_SUCCESSFUL = 'Message emitted successfully';
const QueryMessageMode = () => Query('mode', new ParseEnumPipe(MessageMode, { optional: true }));

@ApiTags('Message Gateway')
@Controller('messages')
export class MessageGatewayController {
  constructor(private readonly chatService: MessageGatewayService) {}

  @Post()
  @HttpCode(202)
  @ApiQuery({ name: 'mode', enum: MessageMode, required: false })
  @ApiBody({ required: true, type: MessageReq })
  @ApiResponse({ description: REQUEST_SUCCESSFUL, status: HttpStatus.ACCEPTED })
  @ApiOperation({
    description: `
          Handles chat messages by emitting them in real-time and optionally queueing them for persistence and vectorization. 
          Messages can be stored for future retrieval or processed for AI-based analysis using BullMQ.`,
  })
  async emit(@Body() message: MessageReq, @QueryMessageMode() mode?: MessageMode) {
    /**
     * For performance optimization, we avoid using object destructuring
     * as it can lead to unnecessary object copying. Directly modifying the
     * object ensures more efficient memory usage and execution speed.
     * "mode" is excluded from Swagger UI documentation, as we want to enforce
     * its use strictly as a query parameter. This ensures that "mode" is only
     * accessible through the query string (not in the request body),
     * which can be important for security and clarity in API design.
     * Despite being excluded from Swagger and query-based only, the "mode" field
     * is still used internally in the application code for processing logic.
     * This allows us to retain functionality without exposing it unnecessarily
     * to external consumers via Swagger.
     */
    message.mode = mode;
    return this.chatService.emit(message);
  }
}
