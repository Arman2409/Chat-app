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
    }
    async afterInit() {
        const messages = await this.service.getMessages();
        this.allMessages = messages;
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
    async handleMessage(from, to, message, file, originalFile) {
        var _a, _b, _c;
        console.log({ originalFile });
        if (file) {
            message = `...(file)...${file}&&${originalFile}&&${message}`;
            console.log(message);
        }
        let alreadyMessaged = this.allMessages.filter(message => message.between.every((elem) => [from, to].indexOf(elem) > -1))[0];
        let messageData = {};
        let previousMessaging;
        if (alreadyMessaged) {
            previousMessaging = this.allMessages.filter(e => { var _a, _b; return (((_a = e.between) === null || _a === void 0 ? void 0 : _a.includes(from)) && ((_b = e.between) === null || _b === void 0 ? void 0 : _b.includes(to))); })[0] || {};
            if (previousMessaging.blocked) {
                return previousMessaging;
            }
            (0, lodash_1.remove)(this.allMessages, (messages) => {
                return messages === previousMessaging;
            });
            messageData = {
                between: previousMessaging.between || [from, to],
                messages: [...previousMessaging.messages || [], message],
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
        messageData = Object.assign(Object.assign({}, messageData), { notSeen: {
                count: ((_b = previousMessaging === null || previousMessaging === void 0 ? void 0 : previousMessaging.notSeen) === null || _b === void 0 ? void 0 : _b.count) + 1 || 1,
                by: (_c = messageData === null || messageData === void 0 ? void 0 : messageData.between) === null || _c === void 0 ? void 0 : _c.indexOf(to)
            } });
        this.allMessages.push(messageData);
        this.server.sockets.in(to).emit("message", messageData);
        await this.service.updateMessages(this.allMessages);
        return messageData;
    }
    async handleNewInterlocuter(currentId, userId) {
        var _a, _b;
        const messaged = this.allMessages.filter(messages => messages.between.includes(currentId) && messages.between.includes(userId));
        if (messaged === null || messaged === void 0 ? void 0 : messaged.length) {
            const previousMessaging = messaged[0];
            if (((_a = previousMessaging.notSeen) === null || _a === void 0 ? void 0 : _a.by) === ((_b = previousMessaging === null || previousMessaging === void 0 ? void 0 : previousMessaging.between) === null || _b === void 0 ? void 0 : _b.indexOf(currentId))) {
                (0, lodash_1.remove)(this.allMessages, (messages) => {
                    var _a, _b;
                    return ((_a = messages.between) === null || _a === void 0 ? void 0 : _a.includes(currentId)) && ((_b = messages.between) === null || _b === void 0 ? void 0 : _b.includes(userId));
                });
                previousMessaging.notSeen.by = 0;
                previousMessaging.notSeen.count = 0;
                this.allMessages.push(previousMessaging);
                await this.service.updateMessages(this.allMessages);
            }
            return previousMessaging;
        }
        else {
            return "Not messaged";
        }
    }
    async handleGetMessages(interlocuters) {
        return await this.allMessages.filter(messages => { var _a; return (_a = messages.between) === null || _a === void 0 ? void 0 : _a.every((id) => interlocuters.indexOf(id) > -1); })[0];
    }
    async blockUser(by, user) {
        var _a;
        const messaged = this.allMessages.filter(messages => messages.between.includes(by) && messages.between.includes(user));
        let messageData;
        if (messaged === null || messaged === void 0 ? void 0 : messaged.length) {
            messageData = messaged[0];
            if (messageData.blocked) {
                return "Already blocked";
            }
            (0, lodash_1.remove)(this.allMessages, (messages) => {
                return messages === messageData;
            });
            messageData.blocked = true;
            messageData.blockedBy = (_a = messageData.between) === null || _a === void 0 ? void 0 : _a.indexOf(by);
        }
        else {
            messageData = {
                between: [by, user],
                blocked: true,
                sequence: [],
                messages: [],
                notSeen: {
                    count: 0,
                    by: 0
                },
                blockedBy: 0,
                lastDate: new Date().toString().slice(0, 10),
            };
        }
        this.allMessages.push(messageData);
        await this.service.updateMessages(this.allMessages);
        const addBlocked = await this.service.addRemoveBlockedUser(by, user, "block");
        if (addBlocked) {
            return addBlocked;
        }
        else {
            return "Not blocked";
        }
    }
    async unBlockUser(by, user) {
        const messaged = this.allMessages.filter(messages => messages.between.includes(by) && messages.between.includes(user));
        let messageData;
        if (messaged === null || messaged === void 0 ? void 0 : messaged.length) {
            messageData = messaged[0];
            (0, lodash_1.remove)(this.allMessages, (messages) => {
                return messages === messageData;
            });
            messageData.blocked = false;
            messageData.blockedBy = 0;
        }
        this.allMessages.push(messageData);
        await this.service.updateMessages(this.allMessages);
        const removeBlocked = await this.service.addRemoveBlockedUser(by, user, "unblock");
        if (removeBlocked) {
            return removeBlocked;
        }
        else {
            return "Not unblocked";
        }
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
    __param(3, (0, websockets_1.MessageBody)("file")),
    __param(4, (0, websockets_1.MessageBody)("orgFile")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
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
__decorate([
    (0, websockets_1.SubscribeMessage)("blockUser"),
    __param(0, (0, websockets_1.MessageBody)("by")),
    __param(1, (0, websockets_1.MessageBody)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WebSocketsGateway.prototype, "blockUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("unBlockUser"),
    __param(0, (0, websockets_1.MessageBody)("by")),
    __param(1, (0, websockets_1.MessageBody)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], WebSocketsGateway.prototype, "unBlockUser", null);
WebSocketsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: "*" }),
    __metadata("design:paramtypes", [sockets_service_1.SocketsService])
], WebSocketsGateway);
exports.WebSocketsGateway = WebSocketsGateway;
exports.default = WebSocketsGateway;
//# sourceMappingURL=sockets.gateway.js.map