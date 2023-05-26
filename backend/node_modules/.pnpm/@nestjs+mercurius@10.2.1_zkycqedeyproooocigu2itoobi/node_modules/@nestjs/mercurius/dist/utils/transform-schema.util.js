"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFederatedSchema = exports.typeIncludesDirective = exports.gatherDirectives = exports.FEDERATION_SCHEMA = void 0;
/**
 * Inspired by the official Mercurius federation `buildFederationSchema`
 * https://github.com/mercurius-js/mercurius/blob/master/lib/federation.js
 *
 */
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const graphql_1 = require("graphql");
const errors_1 = require("mercurius/lib/errors");
const BASE_FEDERATION_TYPES = `
  scalar _Any
  scalar _FieldSet
  directive @external on FIELD_DEFINITION
  directive @requires(fields: _FieldSet!) on FIELD_DEFINITION
  directive @provides(fields: _FieldSet!) on FIELD_DEFINITION
  directive @key(fields: _FieldSet!) on OBJECT | INTERFACE
  directive @extends on OBJECT | INTERFACE
`;
exports.FEDERATION_SCHEMA = `
  ${BASE_FEDERATION_TYPES}
  type _Service {
    sdl: String
  }
`;
function gatherDirectives(type) {
    let directives = [];
    for (const node of type.extensionASTNodes || []) {
        if (node.directives) {
            directives = directives.concat(node.directives);
        }
    }
    if (type.astNode && type.astNode.directives) {
        directives = directives.concat(type.astNode.directives);
    }
    return directives;
}
exports.gatherDirectives = gatherDirectives;
function typeIncludesDirective(type, directiveName) {
    return gatherDirectives(type).some((directive) => directive.name.value === directiveName);
}
exports.typeIncludesDirective = typeIncludesDirective;
function addTypeNameToResult(result, typename) {
    if (result !== null && typeof result === 'object') {
        Object.defineProperty(result, '__typename', {
            value: typename,
        });
    }
    return result;
}
/**
 * Inspired by https://github.com/mercurius-js/mercurius/blob/master/lib/federation.js#L231
 * Accept a GraphQLSchema to transform instead of a plain string containing a graphql schema
 * @param schema
 */
function transformFederatedSchema(schema) {
    // FIXME remove this dependency
    // but graphql#printSchema does not print necessary federation directives
    const { printSubgraphSchema } = (0, load_package_util_1.loadPackage)('@apollo/subgraph', 'FederationFactory', () => require('@apollo/subgraph'));
    // Workaround for https://github.com/mercurius-js/mercurius/issues/273
    const schemaString = printSubgraphSchema(schema)
        .replace('type Query {', 'type Query @extends {')
        .replace('type Mutation {', 'type Mutation @extends {')
        .replace('type Subscription {', 'type Subscription @extends {');
    schema = (0, graphql_1.extendSchema)(schema, (0, graphql_1.parse)(exports.FEDERATION_SCHEMA), {
        assumeValidSDL: true,
    });
    if (!schema.getType('Query')) {
        schema = new graphql_1.GraphQLSchema({
            ...schema.toConfig(),
            query: new graphql_1.GraphQLObjectType({
                name: 'Query',
                fields: {},
            }),
        });
    }
    schema = (0, graphql_1.extendSchema)(schema, (0, graphql_1.parse)(`
    extend type Query {
      _service: _Service!
    }
  `), {
        assumeValid: true,
    });
    const query = schema.getType('Query');
    const queryFields = query.getFields();
    queryFields._service = {
        ...queryFields._service,
        resolve: () => ({ sdl: schemaString }),
    };
    const entityTypes = Object.values(schema.getTypeMap()).filter((type) => (0, graphql_1.isObjectType)(type) && typeIncludesDirective(type, 'key'));
    if (entityTypes.length > 0) {
        schema = (0, graphql_1.extendSchema)(schema, (0, graphql_1.parse)(`
      union _Entity = ${entityTypes.join(' | ')}
      extend type Query {
        _entities(representations: [_Any!]!): [_Entity]!
      }
    `), {
            assumeValid: true,
        });
        const query = schema.getType('Query');
        const queryFields = query.getFields();
        queryFields._entities = {
            ...queryFields._entities,
            resolve: (_source, { representations }, context, info) => {
                return representations.map((reference) => {
                    var _a, _b, _c, _d, _e;
                    const { __typename } = reference;
                    const type = info.schema.getType(__typename);
                    if (!type || !(0, graphql_1.isObjectType)(type)) {
                        throw new errors_1.MER_ERR_GQL_GATEWAY_INVALID_SCHEMA(__typename);
                    }
                    const resolveReference = (_e = (_d = (_c = (_b = (_a = type.extensions) === null || _a === void 0 ? void 0 : _a.apollo) === null || _b === void 0 ? void 0 : _b.subgraph) === null || _c === void 0 ? void 0 : _c.resolveReference) !== null && _d !== void 0 ? _d : 
                    /**
                     * Backcompat for old versions of @apollo/subgraph which didn't use
                     * `extensions` This can be removed when support for
                     * @apollo/subgraph < 0.4.2 is dropped Reference:
                     * https://github.com/apollographql/federation/pull/1747
                     */
                    // @ts-expect-error (explanation above)
                    type.resolveReference) !== null && _e !== void 0 ? _e : function defaultResolveReference() {
                        return reference;
                    };
                    const result = resolveReference(reference, {}, context, info);
                    if (result && 'then' in result && typeof result.then === 'function') {
                        return result.then((x) => addTypeNameToResult(x, __typename));
                    }
                    return addTypeNameToResult(result, __typename);
                });
            },
        };
    }
    return schema;
}
exports.transformFederatedSchema = transformFederatedSchema;
