"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const lodash_1 = require("lodash");
const sockets_service_1 = require("./sockets.service");
let WebSocketsGateway = class WebSocketsGateway {
    constructor(service) {
        this.service = service;
        this.activeUsers = [];
        this.allMessages = [];
        this.previousAllMessages = [];
    }
    async afterInit() {
        this.allMessages = await this.service.getMessages();
        setInterval(async () => {
            if (!(0, lodash_1.isEqual)(this.allMessages, this.previousAllMessages)) {
                console.log("not equal");
                await this.service.updateMessages(this.allMessages);
                this.previousAllMessages = [...this.allMessages];
            }
        }, 500);
    }
    handleConnection() {
    }
    async handleDisconnect(client) {
        const { id, active } = client.handshake;
        if (!active || !id) {
            return;
        }
        this.activeUsers.splice(this.activeUsers.indexOf(id), 1);
        await this.service.updateUserStatus(id, false);
    }
    async handleConnect(id, client) {
        this.activeUsers.push(id);
        const update = this.service.updateUserStatus(id, true, true);
        client.join(id === null || id === void 0 ? void 0 : id.toString());
        client.handshake.id = id;
        client.handshake.active = true;
        const notSeenCount = this.allMessages.filter(message => {
            var _a, _b, _c;
            const notSeenByUser = ((_a = message === null || message === void 0 ? void 0 : message.notSeen) === null || _a === void 0 ? void 0 : _a.by) === ((_b = message.between) === null || _b === void 0 ? void 0 : _b.indexOf(id));
            if (notSeenByUser) {
                return ((_c = message === null || message === void 0 ? void 0 : message.notSeen) === null || _c === void 0 ? void 0 : _c.count) > 0;
            }
        });
        if (update) {
            return { notSeenCount: notSeenCount.length };
        }
        else {
            return "Not Connected";
        }
    }
    ;
    handleMessage(from, to, message) {
        var _a, _b, _c;
        let alreadyMessaged = this.allMessages.filter(message => message.between.every((elem) => [from, to].indexOf(elem) > -1))[0];
        let messageData = {};
        let previousMessaging;
        if (alreadyMessaged) {
            previousMessaging = this.allMessages.filter(e => { var _a, _b; return (((_a = e.between) === null || _a === void 0 ? void 0 : _a.includes(from)) && ((_b = e.between) === null || _b === void 0 ? void 0 : _b.includes(to))); })[0] || {};
            (0, lodash_1.remove)(this.allMessages, (messages) => {
                return messages.between.includes(previousMessaging.between[0]) && messages.between.includes(previousMessaging.between[1]);
            });
            messageData = {
                between: previousMessaging.between || [from, to],
                messages: [...previousMessaging.messages || [message], message],
                sequence: [...previousMessaging.sequence || [0], (_a = previousMessaging.between) === null || _a === void 0 ? void 0 : _a.indexOf(from)],
                lastDate: new Date().toString().slice(0, 10),
            };
        }
        else {
            messageData = {
                between: [from, to],
                sequence: [0],
                messages: [message],
                lastDate: new Date().toString().slice(0, 10),
            };
        }
        if (this.activeUsers.includes(to)) {
            this.allMessages.push(Object.assign(Object.assign({}, messageData), { notSeen: {
                    count: 0,
                    by: 0
                } }));
        }
        else {
            this.allMessages.push(Object.assign(Object.assign({}, messageData), { notSeen: {
                    count: ((_b = previousMessaging === null || previousMessaging === void 0 ? void 0 : previousMessaging.notSeen) === null || _b === void 0 ? void 0 : _b.count) + 1 || 1,
                    by: (_c = messageData === null || messageData === void 0 ? void 0 : messageData.between) === null || _c === void 0 ? void 0 : _c.indexOf(to)
                } }));
        }
        ;
        this.server.sockets.in(to).emit("message", messageData);
        return messageData;
    }
    async handleNewInterlocuter(currentId, userId) {
        var _a, _b;
        const messaged = this.allMessages.filter(messages => messages.between.includes(currentId) && messages.between.includes(userId));
        if (messaged === null || messaged === void 0 ? void 0 : messaged.length) {
            const previousMessaging = messaged[0];
            if (((_a = previousMessaging.notSeen) === null || _a === void 0 ? void 0 : _a.by) === ((_b = previousMessaging === null || previousMessaging === void 0 ? void 0 : previousMessaging.between) === null || _b === void 0 ? void 0 : _b.indexOf(currentId))) {
                (0, lodash_1.remove)(this.allMessages, (messages) => {
                    console.log(messages === previousMessaging);
                    return messages === previousMessaging;
                });
                previousMessaging.notSeen.count = 0;
                this.allMessages.push(previousMessaging);
                return "Got new interlocuter";
            }
        }
        else {
            return "Not messaged";
        }
    }
    async handleGetMessages(interlocuters) {
        return await this.allMessages.filter(messages => { var _a; return (_a = messages.between) === null || _a === void 0 ? void 0 : _a.every((id) => interlocuters.indexOf(id) > -1); })[0];
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebSocketsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("signedIn"),
    __param(0, (0, websockets_1.MessageBody)("id")),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebSocketsGateway.prototype, "handleConnect", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("message"),
    __param(0, (0, websockets_1.MessageBody)("from")),
    __param(1, (0, websockets_1.MessageBody)("to")),
    __param(2, (0, websockets_1.MessageBody)("message")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], WebSocketsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("newInterlocutor"),
    __param(0, (0, websockets_1.MessageBody)("id")),
    __param(1, (0, websockets_1.MessageBody)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WebSocketsGateway.prototype, "handleNewInterlocuter", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("getMessages"),
    __param(0, (0, websockets_1.MessageBody)("interlocuters")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], WebSocketsGateway.prototype, "handleGetMessages", null);
WebSocketsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*" }),
    __metadata("design:paramtypes", [sockets_service_1.SocketsService])
], WebSocketsGateway);
exports.WebSocketsGateway = WebSocketsGateway;
exports.default = WebSocketsGateway;
//# sourceMappingURL=sockets.gateway.js.map