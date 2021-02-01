/* eslint-disable @typescript-eslint/no-unused-vars */
import { DocumentNode } from "graphql";
import * as L from "./_generated_documents";

/** The function for calling the graphql client */
export type Request = <Response, Variables>(doc: DocumentNode, variables?: Variables) => Promise<Response>;

/**
 * Base class to provide a request function
 *
 * @param request - function to call the graphql client
 */
export class LinearRequest {
  protected _request: Request;

  public constructor(request: Request) {
    this._request = request;
  }
}

/** Fetch return type wrapped in a promise */
export type Fetch<Response> = Promise<Response | undefined>;

/**
 * Variables required for pagination
 * Follows the Relay spec
 */
export type ConnectionVariables = { after?: string; before?: string };

/**
 * Abstract class for connection models containing a list of nodes and pagination information
 * Follows the Relay spec
 */
export abstract class Connection<Node> extends LinearRequest {
  public pageInfo?: PageInfo;
  public nodes?: Node[];
}

/**
 * The base connection class to provide pagination
 * Follows the Relay spec
 *
 * @param request - function to call the graphql client
 * @param fetch - Function to refetch the connection given different pagination variables
 * @param nodes - The list of models to initialize the connection
 * @param pageInfo - The pagination information to initialize the connection
 */
export class LinearConnection<Node> extends Connection<Node> {
  private _fetch: (variables?: ConnectionVariables) => Fetch<Connection<Node>>;

  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Node>>,
    nodes?: Node[],
    pageInfo?: PageInfo
  ) {
    super(request);
    this._fetch = fetch;
    this.nodes = nodes;
    this.pageInfo = pageInfo;
  }

  /** Add nodes to the end of the existing nodes */
  private _appendNodes(nodes?: Node[]) {
    this.nodes = nodes ? [...(this.nodes ?? []), ...nodes] : this.nodes;
  }

  /** Add nodes to the start of the existing nodes */
  private _prependNodes(nodes?: Node[]) {
    this.nodes = nodes ? [...nodes, ...(this.nodes ?? [])] : this.nodes;
  }

  /** Update the pagination end cursor */
  private _appendPageInfo(pageInfo?: PageInfo) {
    if (this.pageInfo) {
      this.pageInfo.endCursor = pageInfo?.endCursor ?? this.pageInfo.startCursor;
      this.pageInfo.hasNextPage = pageInfo?.hasNextPage ?? this.pageInfo.hasNextPage;
    }
  }

  /** Update the pagination start cursor */
  private _prependPageInfo(pageInfo?: PageInfo) {
    if (this.pageInfo) {
      this.pageInfo.startCursor = pageInfo?.startCursor ?? this.pageInfo.startCursor;
      this.pageInfo.hasPreviousPage = pageInfo?.hasPreviousPage ?? this.pageInfo.hasPreviousPage;
    }
  }

  /** Fetch the next page of results and append to nodes */
  public get fetchNext(): Promise<this> {
    return this.pageInfo?.hasNextPage
      ? this._fetch({ after: this.pageInfo?.endCursor }).then(response => {
          this._appendNodes(response?.nodes);
          this._appendPageInfo(response?.pageInfo);
          return this;
        })
      : Promise.resolve(this);
  }

  /** Fetch the previous page of results and prepend to nodes */
  public get fetchPrevious(): Promise<this> {
    return this.pageInfo?.hasPreviousPage
      ? this._fetch({ before: this.pageInfo?.startCursor }).then(response => {
          this._prependNodes(response?.nodes);
          this._prependPageInfo(response?.pageInfo);
          return this;
        })
      : Promise.resolve(this);
  }
}
/**
 * An API key. Grants access to the user's resources.
 *
 * @param request - function to call the graphql client
 * @param data - L.ApiKeyFragment response data
 */
export class ApiKey extends LinearRequest {
  public constructor(request: Request, data: L.ApiKeyFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.label = data.label ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The label of the API key. */
  public label?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
}
/**
 * ApiKeyConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this ApiKeyConnection model
 * @param data - ApiKeyConnection response data
 */
export class ApiKeyConnection extends LinearConnection<ApiKey> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<ApiKey>>,
    data: L.ApiKeyConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new ApiKey(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * ApiKeyPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ApiKeyPayloadFragment response data
 */
export class ApiKeyPayload extends LinearRequest {
  public constructor(request: Request, data: L.ApiKeyPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.apiKey = data.apiKey ? new ApiKey(request, data.apiKey) : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The API key that was created. */
  public apiKey?: ApiKey;
}
/**
 * Public information of the OAuth application.
 *
 * @param request - function to call the graphql client
 * @param data - L.ApplicationFragment response data
 */
export class Application extends LinearRequest {
  public constructor(request: Request, data: L.ApplicationFragment) {
    super(request);
    this.clientId = data.clientId ?? undefined;
    this.description = data.description ?? undefined;
    this.developer = data.developer ?? undefined;
    this.developerUrl = data.developerUrl ?? undefined;
    this.imageUrl = data.imageUrl ?? undefined;
    this.name = data.name ?? undefined;
  }

  /** OAuth application's client ID. */
  public clientId?: string;
  /** Information about the application. */
  public description?: string;
  /** Name of the developer. */
  public developer?: string;
  /** Url of the developer (homepage or docs). */
  public developerUrl?: string;
  /** Image of the application. */
  public imageUrl?: string;
  /** Application name. */
  public name?: string;
}
/**
 * ArchivePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ArchivePayloadFragment response data
 */
export class ArchivePayload extends LinearRequest {
  public constructor(request: Request, data: L.ArchivePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * Contains requested archived model objects.
 *
 * @param request - function to call the graphql client
 * @param data - L.ArchiveResponseFragment response data
 */
export class ArchiveResponse extends LinearRequest {
  public constructor(request: Request, data: L.ArchiveResponseFragment) {
    super(request);
    this.archive = data.archive ?? undefined;
    this.databaseVersion = data.databaseVersion ?? undefined;
    this.totalCount = data.totalCount ?? undefined;
  }

  /** A JSON serialized collection of model objects loaded from the archive */
  public archive?: string;
  /** The version of the remote database. Incremented by 1 for each migration run on the database. */
  public databaseVersion?: number;
  /** The total number of entities in the archive. */
  public totalCount?: number;
}
/**
 * AuthResolverResponse model
 *
 * @param request - function to call the graphql client
 * @param data - L.AuthResolverResponseFragment response data
 */
export class AuthResolverResponse extends LinearRequest {
  public constructor(request: Request, data: L.AuthResolverResponseFragment) {
    super(request);
    this.allowDomainAccess = data.allowDomainAccess ?? undefined;
    this.email = data.email ?? undefined;
    this.id = data.id ?? undefined;
    this.token = data.token ?? undefined;
    this.availableOrganizations = data.availableOrganizations
      ? data.availableOrganizations.map(node => new Organization(request, node))
      : undefined;
    this.users = data.users ? data.users.map(node => new User(request, node)) : undefined;
  }

  /** Should the signup flow allow access for the domain. */
  public allowDomainAccess?: boolean;
  /** Email for the authenticated account. */
  public email?: string;
  /** User account ID. */
  public id?: string;
  /** JWT token for authentication of the account. */
  public token?: string;
  /** Organizations this account has access to, but is not yet a member. */
  public availableOrganizations?: Organization[];
  /** Users belonging to this account. */
  public users?: User[];
}
/**
 * Public information of the OAuth application, plus the authorized scopes for a given user.
 *
 * @param request - function to call the graphql client
 * @param data - L.AuthorizedApplicationFragment response data
 */
export class AuthorizedApplication extends LinearRequest {
  public constructor(request: Request, data: L.AuthorizedApplicationFragment) {
    super(request);
    this.appId = data.appId ?? undefined;
    this.clientId = data.clientId ?? undefined;
    this.description = data.description ?? undefined;
    this.developer = data.developer ?? undefined;
    this.developerUrl = data.developerUrl ?? undefined;
    this.imageUrl = data.imageUrl ?? undefined;
    this.name = data.name ?? undefined;
    this.scope = data.scope ?? undefined;
  }

  /** OAuth application's ID. */
  public appId?: string;
  /** OAuth application's client ID. */
  public clientId?: string;
  /** Information about the application. */
  public description?: string;
  /** Name of the developer. */
  public developer?: string;
  /** Url of the developer (homepage or docs). */
  public developerUrl?: string;
  /** Image of the application. */
  public imageUrl?: string;
  /** Application name. */
  public name?: string;
  /** Scopes that are authorized for this application for a given user. */
  public scope?: string[];
}
/**
 * BillingDetailsPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.BillingDetailsPayloadFragment response data
 */
export class BillingDetailsPayload extends LinearRequest {
  public constructor(request: Request, data: L.BillingDetailsPayloadFragment) {
    super(request);
    this.email = data.email ?? undefined;
    this.success = data.success ?? undefined;
    this.paymentMethod = data.paymentMethod ? new Card(request, data.paymentMethod) : undefined;
    this.invoices = data.invoices ? data.invoices.map(node => new Invoice(request, node)) : undefined;
  }

  /** The customer's email address the invoices are sent to. */
  public email?: string;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** List of invoices, if any. */
  public invoices?: Invoice[];
  /** The payment method. */
  public paymentMethod?: Card;
}
/**
 * BillingEmailPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.BillingEmailPayloadFragment response data
 */
export class BillingEmailPayload extends LinearRequest {
  public constructor(request: Request, data: L.BillingEmailPayloadFragment) {
    super(request);
    this.email = data.email ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The customer's email address the invoices are sent to. */
  public email?: string;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * Card model
 *
 * @param request - function to call the graphql client
 * @param data - L.CardFragment response data
 */
export class Card extends LinearRequest {
  public constructor(request: Request, data: L.CardFragment) {
    super(request);
    this.brand = data.brand ?? undefined;
    this.last4 = data.last4 ?? undefined;
  }

  /** The brand of the card, e.g. Visa. */
  public brand?: string;
  /** The last four digits used to identify the card. */
  public last4?: string;
}
/**
 * CollaborationDocumentUpdatePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.CollaborationDocumentUpdatePayloadFragment response data
 */
export class CollaborationDocumentUpdatePayload extends LinearRequest {
  public constructor(request: Request, data: L.CollaborationDocumentUpdatePayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
    this.steps = data.steps ? new StepsResponse(request, data.steps) : undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
  /** Document steps the client has not seen yet and need to rebase it's local steps on. */
  public steps?: StepsResponse;
}
/**
 * A comment associated with an issue.
 *
 * @param request - function to call the graphql client
 * @param data - L.CommentFragment response data
 */
export class Comment extends LinearRequest {
  private _issue?: L.CommentFragment["issue"];
  private _user?: L.CommentFragment["user"];

  public constructor(request: Request, data: L.CommentFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.body = data.body ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.editedAt = data.editedAt ?? undefined;
    this.id = data.id ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._issue = data.issue ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The comment content in markdown format. */
  public body?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The time user edited the comment. */
  public editedAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The issue that the comment is associated with. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
  /** The user who wrote the comment. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * CommentConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this CommentConnection model
 * @param data - CommentConnection response data
 */
export class CommentConnection extends LinearConnection<Comment> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Comment>>,
    data: L.CommentConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Comment(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * CommentPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.CommentPayloadFragment response data
 */
export class CommentPayload extends LinearRequest {
  private _comment?: L.CommentPayloadFragment["comment"];

  public constructor(request: Request, data: L.CommentPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._comment = data.comment ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The comment that was created or updated. */
  public get comment(): Fetch<Comment> | undefined {
    return this._comment?.id ? new CommentQuery(this._request).fetch(this._comment?.id) : undefined;
  }
}
/**
 * GitHub's commit data
 *
 * @param request - function to call the graphql client
 * @param data - L.CommitPayloadFragment response data
 */
export class CommitPayload extends LinearRequest {
  public constructor(request: Request, data: L.CommitPayloadFragment) {
    super(request);
    this.added = data.added ?? undefined;
    this.id = data.id ?? undefined;
    this.message = data.message ?? undefined;
    this.modified = data.modified ?? undefined;
    this.removed = data.removed ?? undefined;
    this.timestamp = data.timestamp ?? undefined;
    this.url = data.url ?? undefined;
  }

  public added?: string[];
  public id?: string;
  public message?: string;
  public modified?: string[];
  public removed?: string[];
  public timestamp?: string;
  public url?: string;
}
/**
 * ContactPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ContactPayloadFragment response data
 */
export class ContactPayload extends LinearRequest {
  public constructor(request: Request, data: L.ContactPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * CreateCsvExportReportPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.CreateCsvExportReportPayloadFragment response data
 */
export class CreateCsvExportReportPayload extends LinearRequest {
  public constructor(request: Request, data: L.CreateCsvExportReportPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * CreateOrJoinOrganizationResponse model
 *
 * @param request - function to call the graphql client
 * @param data - L.CreateOrJoinOrganizationResponseFragment response data
 */
export class CreateOrJoinOrganizationResponse extends LinearRequest {
  private _user?: L.CreateOrJoinOrganizationResponseFragment["user"];

  public constructor(request: Request, data: L.CreateOrJoinOrganizationResponseFragment) {
    super(request);
    this._user = data.user ?? undefined;
  }

  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * A custom view that has been saved by a user.
 *
 * @param request - function to call the graphql client
 * @param data - L.CustomViewFragment response data
 */
export class CustomView extends LinearRequest {
  private _creator?: L.CustomViewFragment["creator"];
  private _team?: L.CustomViewFragment["team"];

  public constructor(request: Request, data: L.CustomViewFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.color = data.color ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.filters = data.filters ?? undefined;
    this.icon = data.icon ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.shared = data.shared ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._creator = data.creator ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The color of the icon of the custom view. */
  public color?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The description of the custom view. */
  public description?: string;
  /** The filters applied to issues in the custom view. */
  public filters?: L.Scalars["JSONObject"];
  /** The icon of the custom view. */
  public icon?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The name of the custom view. */
  public name?: string;
  /** Whether the custom view is shared with everyone in the organization. */
  public shared?: boolean;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user who created the custom view. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The organization of the custom view. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /** The team associated with the custom view. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
}
/**
 * CustomViewConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this CustomViewConnection model
 * @param data - CustomViewConnection response data
 */
export class CustomViewConnection extends LinearConnection<CustomView> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<CustomView>>,
    data: L.CustomViewConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new CustomView(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * CustomViewPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.CustomViewPayloadFragment response data
 */
export class CustomViewPayload extends LinearRequest {
  private _customView?: L.CustomViewPayloadFragment["customView"];

  public constructor(request: Request, data: L.CustomViewPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._customView = data.customView ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The custom view that was created or updated. */
  public get customView(): Fetch<CustomView> | undefined {
    return this._customView?.id ? new CustomViewQuery(this._request).fetch(this._customView?.id) : undefined;
  }
}
/**
 * A set of issues to be resolved in a specified amount of time.
 *
 * @param request - function to call the graphql client
 * @param data - L.CycleFragment response data
 */
export class Cycle extends LinearRequest {
  private _team?: L.CycleFragment["team"];

  public constructor(request: Request, data: L.CycleFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.completedAt = data.completedAt ?? undefined;
    this.completedIssueCountHistory = data.completedIssueCountHistory ?? undefined;
    this.completedScopeHistory = data.completedScopeHistory ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.endsAt = data.endsAt ?? undefined;
    this.id = data.id ?? undefined;
    this.issueCountHistory = data.issueCountHistory ?? undefined;
    this.name = data.name ?? undefined;
    this.number = data.number ?? undefined;
    this.scopeHistory = data.scopeHistory ?? undefined;
    this.startsAt = data.startsAt ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The completion time of the cycle. If null, the cycle hasn't been completed. */
  public completedAt?: L.Scalars["DateTime"];
  /** The number of completed issues in the cycle after each day. */
  public completedIssueCountHistory?: number[];
  /** The number of completed estimation points after each day. */
  public completedScopeHistory?: number[];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The end time of the cycle. */
  public endsAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The total number of issues in the cycle after each day. */
  public issueCountHistory?: number[];
  /** The custom name of the cycle. */
  public name?: string;
  /** The number of the cycle. */
  public number?: number;
  /** The total number of estimation points after each day. */
  public scopeHistory?: number[];
  /** The start time of the cycle. */
  public startsAt?: L.Scalars["DateTime"];
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The team that the cycle is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** Issues associated with the cycle. */
  public issues(variables?: Omit<L.Cycle_IssuesQueryVariables, "id">) {
    return this.id ? new Cycle_IssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Issues that weren't completed when the cycle was closed. */
  public uncompletedIssuesUponClose(variables?: Omit<L.Cycle_UncompletedIssuesUponCloseQueryVariables, "id">) {
    return this.id ? new Cycle_UncompletedIssuesUponCloseQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * CycleConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this CycleConnection model
 * @param data - CycleConnection response data
 */
export class CycleConnection extends LinearConnection<Cycle> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Cycle>>,
    data: L.CycleConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Cycle(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * CyclePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.CyclePayloadFragment response data
 */
export class CyclePayload extends LinearRequest {
  private _cycle?: L.CyclePayloadFragment["cycle"];

  public constructor(request: Request, data: L.CyclePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._cycle = data.cycle ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The Cycle that was created or updated. */
  public get cycle(): Fetch<Cycle> | undefined {
    return this._cycle?.id ? new CycleQuery(this._request).fetch(this._cycle?.id) : undefined;
  }
}
/**
 * DebugPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.DebugPayloadFragment response data
 */
export class DebugPayload extends LinearRequest {
  public constructor(request: Request, data: L.DebugPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * Collaborative editing steps for documents.
 *
 * @param request - function to call the graphql client
 * @param data - L.DocumentStepFragment response data
 */
export class DocumentStep extends LinearRequest {
  public constructor(request: Request, data: L.DocumentStepFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.clientId = data.clientId ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.step = data.step ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.version = data.version ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** Connected client ID. */
  public clientId?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** Step data. */
  public step?: L.Scalars["JSON"];
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Step version. */
  public version?: number;
}
/**
 * EmailUnsubscribePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.EmailUnsubscribePayloadFragment response data
 */
export class EmailUnsubscribePayload extends LinearRequest {
  public constructor(request: Request, data: L.EmailUnsubscribePayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * EmailUserAccountAuthChallengeResponse model
 *
 * @param request - function to call the graphql client
 * @param data - L.EmailUserAccountAuthChallengeResponseFragment response data
 */
export class EmailUserAccountAuthChallengeResponse extends LinearRequest {
  public constructor(request: Request, data: L.EmailUserAccountAuthChallengeResponseFragment) {
    super(request);
    this.authType = data.authType ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** Supported challenge for this user account. Can be either verificationCode or password. */
  public authType?: string;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * A custom emoji.
 *
 * @param request - function to call the graphql client
 * @param data - L.EmojiFragment response data
 */
export class Emoji extends LinearRequest {
  private _creator?: L.EmojiFragment["creator"];

  public constructor(request: Request, data: L.EmojiFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.source = data.source ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.url = data.url ?? undefined;
    this._creator = data.creator ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The emoji's name. */
  public name?: string;
  /** The source of the emoji. */
  public source?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The emoji image URL. */
  public url?: string;
  /** The user who created the emoji. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The organization that the emoji belongs to. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
}
/**
 * EmojiConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this EmojiConnection model
 * @param data - EmojiConnection response data
 */
export class EmojiConnection extends LinearConnection<Emoji> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Emoji>>,
    data: L.EmojiConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Emoji(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * EmojiPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.EmojiPayloadFragment response data
 */
export class EmojiPayload extends LinearRequest {
  private _emoji?: L.EmojiPayloadFragment["emoji"];

  public constructor(request: Request, data: L.EmojiPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._emoji = data.emoji ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The emoji that was created. */
  public get emoji(): Fetch<Emoji> | undefined {
    return this._emoji?.id ? new EmojiQuery(this._request).fetch(this._emoji?.id) : undefined;
  }
}
/**
 * EventPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.EventPayloadFragment response data
 */
export class EventPayload extends LinearRequest {
  public constructor(request: Request, data: L.EventPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * User favorites presented in the sidebar.
 *
 * @param request - function to call the graphql client
 * @param data - L.FavoriteFragment response data
 */
export class Favorite extends LinearRequest {
  private _cycle?: L.FavoriteFragment["cycle"];
  private _issue?: L.FavoriteFragment["issue"];
  private _label?: L.FavoriteFragment["label"];
  private _project?: L.FavoriteFragment["project"];
  private _projectTeam?: L.FavoriteFragment["projectTeam"];
  private _user?: L.FavoriteFragment["user"];

  public constructor(request: Request, data: L.FavoriteFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.sortOrder = data.sortOrder ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._cycle = data.cycle ?? undefined;
    this._issue = data.issue ?? undefined;
    this._label = data.label ?? undefined;
    this._project = data.project ?? undefined;
    this._projectTeam = data.projectTeam ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The order of the item in the favorites list. */
  public sortOrder?: number;
  /** The type of the favorite. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Favorited cycle. */
  public get cycle(): Fetch<Cycle> | undefined {
    return this._cycle?.id ? new CycleQuery(this._request).fetch(this._cycle?.id) : undefined;
  }
  /** Favorited issue. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
  /** Favorited issue label. */
  public get label(): Fetch<IssueLabel> | undefined {
    return this._label?.id ? new IssueLabelQuery(this._request).fetch(this._label?.id) : undefined;
  }
  /** Favorited project. */
  public get project(): Fetch<Project> | undefined {
    return this._project?.id ? new ProjectQuery(this._request).fetch(this._project?.id) : undefined;
  }
  /** Favorited project team. */
  public get projectTeam(): Fetch<Project> | undefined {
    return this._projectTeam?.id ? new ProjectQuery(this._request).fetch(this._projectTeam?.id) : undefined;
  }
  /** The owner of the favorite. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * FavoriteConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this FavoriteConnection model
 * @param data - FavoriteConnection response data
 */
export class FavoriteConnection extends LinearConnection<Favorite> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Favorite>>,
    data: L.FavoriteConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Favorite(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * FavoritePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.FavoritePayloadFragment response data
 */
export class FavoritePayload extends LinearRequest {
  private _favorite?: L.FavoritePayloadFragment["favorite"];

  public constructor(request: Request, data: L.FavoritePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._favorite = data.favorite ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The object that was added as a favorite. */
  public get favorite(): Fetch<Favorite> | undefined {
    return this._favorite?.id ? new FavoriteQuery(this._request).fetch(this._favorite?.id) : undefined;
  }
}
/**
 * FeedbackPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.FeedbackPayloadFragment response data
 */
export class FeedbackPayload extends LinearRequest {
  public constructor(request: Request, data: L.FeedbackPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * Object representing Figma preview information.
 *
 * @param request - function to call the graphql client
 * @param data - L.FigmaEmbedFragment response data
 */
export class FigmaEmbed extends LinearRequest {
  public constructor(request: Request, data: L.FigmaEmbedFragment) {
    super(request);
    this.lastModified = data.lastModified ?? undefined;
    this.name = data.name ?? undefined;
    this.nodeName = data.nodeName ?? undefined;
    this.url = data.url ?? undefined;
  }

  /** Date when the file was updated at the time of embedding. */
  public lastModified?: L.Scalars["DateTime"];
  /** Figma file name. */
  public name?: string;
  /** Node name. */
  public nodeName?: string;
  /** Figma screenshot URL. */
  public url?: string;
}
/**
 * FigmaEmbedPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.FigmaEmbedPayloadFragment response data
 */
export class FigmaEmbedPayload extends LinearRequest {
  public constructor(request: Request, data: L.FigmaEmbedPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.figmaEmbed = data.figmaEmbed ? new FigmaEmbed(request, data.figmaEmbed) : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** Figma embed information. */
  public figmaEmbed?: FigmaEmbed;
}
/**
 * A recorded entry of a file uploaded by a user.
 *
 * @param request - function to call the graphql client
 * @param data - L.FileUploadFragment response data
 */
export class FileUpload extends LinearRequest {
  private _creator?: L.FileUploadFragment["creator"];

  public constructor(request: Request, data: L.FileUploadFragment) {
    super(request);
    this.assetUrl = data.assetUrl ?? undefined;
    this.contentType = data.contentType ?? undefined;
    this.filename = data.filename ?? undefined;
    this.id = data.id ?? undefined;
    this.metaData = data.metaData ?? undefined;
    this.size = data.size ?? undefined;
    this._creator = data.creator ?? undefined;
  }

  /** The asset URL this file is available at. */
  public assetUrl?: string;
  /** The MIME type of the uploaded file. */
  public contentType?: string;
  /** The name of the uploaded file. */
  public filename?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Additional metadata of the file. */
  public metaData?: L.Scalars["JSON"];
  /** Size of the uploaded file in bytes. */
  public size?: number;
  /** The user who uploaded the file. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The organization the upload belongs to. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
}
/**
 * Google Sheets specific settings.
 *
 * @param request - function to call the graphql client
 * @param data - L.GoogleSheetsSettingsFragment response data
 */
export class GoogleSheetsSettings extends LinearRequest {
  public constructor(request: Request, data: L.GoogleSheetsSettingsFragment) {
    super(request);
    this.sheetId = data.sheetId ?? undefined;
    this.spreadsheetId = data.spreadsheetId ?? undefined;
    this.spreadsheetUrl = data.spreadsheetUrl ?? undefined;
    this.updatedIssuesAt = data.updatedIssuesAt ?? undefined;
  }

  public sheetId?: number;
  public spreadsheetId?: string;
  public spreadsheetUrl?: string;
  public updatedIssuesAt?: L.Scalars["DateTime"];
}
/**
 * ImageUploadFromUrlPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ImageUploadFromUrlPayloadFragment response data
 */
export class ImageUploadFromUrlPayload extends LinearRequest {
  public constructor(request: Request, data: L.ImageUploadFromUrlPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.url = data.url ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The URL containing the image. */
  public url?: string;
}
/**
 * An integration with an external service.
 *
 * @param request - function to call the graphql client
 * @param data - L.IntegrationFragment response data
 */
export class Integration extends LinearRequest {
  private _creator?: L.IntegrationFragment["creator"];
  private _team?: L.IntegrationFragment["team"];

  public constructor(request: Request, data: L.IntegrationFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.service = data.service ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._creator = data.creator ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The integration's type. */
  public service?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user that added the integration. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The organization that the integration is associated with. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /** The team that the integration is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
}
/**
 * IntegrationConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this IntegrationConnection model
 * @param data - IntegrationConnection response data
 */
export class IntegrationConnection extends LinearConnection<Integration> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Integration>>,
    data: L.IntegrationConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Integration(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * IntegrationPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.IntegrationPayloadFragment response data
 */
export class IntegrationPayload extends LinearRequest {
  private _integration?: L.IntegrationPayloadFragment["integration"];

  public constructor(request: Request, data: L.IntegrationPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._integration = data.integration ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The integration that was created or updated. */
  public get integration(): Fetch<Integration> | undefined {
    return this._integration?.id ? new IntegrationQuery(this._request).fetch(this._integration?.id) : undefined;
  }
}
/**
 * An integration resource created by an external service.
 *
 * @param request - function to call the graphql client
 * @param data - L.IntegrationResourceFragment response data
 */
export class IntegrationResource extends LinearRequest {
  private _integration?: L.IntegrationResourceFragment["integration"];
  private _issue?: L.IntegrationResourceFragment["issue"];

  public constructor(request: Request, data: L.IntegrationResourceFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.resourceId = data.resourceId ?? undefined;
    this.resourceType = data.resourceType ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._integration = data.integration ?? undefined;
    this._issue = data.issue ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The external service resource ID. */
  public resourceId?: string;
  /** The integration's type. */
  public resourceType?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The integration that the resource is associated with. */
  public get integration(): Fetch<Integration> | undefined {
    return this._integration?.id ? new IntegrationQuery(this._request).fetch(this._integration?.id) : undefined;
  }
  /** The issue that the resource is associated with. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
  /** Detailed information about the external resource. */
  public get data() {
    return this.id ? new IntegrationResource_DataQuery(this._request, this.id).fetch() : undefined;
  }
  /** Pull request information for GitHub pull requests and GitLab merge requests. */
  public get pullRequest() {
    return this.id ? new IntegrationResource_PullRequestQuery(this._request, this.id).fetch() : undefined;
  }
}
/**
 * IntegrationResourceConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this IntegrationResourceConnection model
 * @param data - IntegrationResourceConnection response data
 */
export class IntegrationResourceConnection extends LinearConnection<IntegrationResource> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<IntegrationResource>>,
    data: L.IntegrationResourceConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new IntegrationResource(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * Integration resource's payload
 *
 * @param request - function to call the graphql client
 * @param data - L.IntegrationResourceDataFragment response data
 */
export class IntegrationResourceData extends LinearRequest {
  public constructor(request: Request, data: L.IntegrationResourceDataFragment) {
    super(request);
    this.githubCommit = data.githubCommit ? new CommitPayload(request, data.githubCommit) : undefined;
    this.githubPullRequest = data.githubPullRequest
      ? new PullRequestPayload(request, data.githubPullRequest)
      : undefined;
    this.gitlabMergeRequest = data.gitlabMergeRequest
      ? new PullRequestPayload(request, data.gitlabMergeRequest)
      : undefined;
    this.sentryIssue = data.sentryIssue ? new SentryIssuePayload(request, data.sentryIssue) : undefined;
  }

  /** The payload for an IntegrationResource of type 'githubCommit' */
  public githubCommit?: CommitPayload;
  /** The payload for an IntegrationResource of type 'githubPullRequest' */
  public githubPullRequest?: PullRequestPayload;
  /** The payload for an IntegrationResource of type 'gitlabMergeRequest' */
  public gitlabMergeRequest?: PullRequestPayload;
  /** The payload for an IntegrationResource of type 'sentryIssue' */
  public sentryIssue?: SentryIssuePayload;
}
/**
 * The integration resource's settings
 *
 * @param request - function to call the graphql client
 * @param data - L.IntegrationSettingsFragment response data
 */
export class IntegrationSettings extends LinearRequest {
  public constructor(request: Request, data: L.IntegrationSettingsFragment) {
    super(request);
    this.googleSheets = data.googleSheets ? new GoogleSheetsSettings(request, data.googleSheets) : undefined;
    this.sentry = data.sentry ? new SentrySettings(request, data.sentry) : undefined;
    this.slackPost = data.slackPost ? new SlackPostSettings(request, data.slackPost) : undefined;
    this.slackProjectPost = data.slackProjectPost ? new SlackPostSettings(request, data.slackProjectPost) : undefined;
  }

  public googleSheets?: GoogleSheetsSettings;
  public sentry?: SentrySettings;
  public slackPost?: SlackPostSettings;
  public slackProjectPost?: SlackPostSettings;
}
/**
 * InviteData model
 *
 * @param request - function to call the graphql client
 * @param data - L.InviteDataFragment response data
 */
export class InviteData extends LinearRequest {
  public constructor(request: Request, data: L.InviteDataFragment) {
    super(request);
    this.avatarURLs = data.avatarURLs ?? undefined;
    this.inviterName = data.inviterName ?? undefined;
    this.organizationDomain = data.organizationDomain ?? undefined;
    this.organizationLogoUrl = data.organizationLogoUrl ?? undefined;
    this.organizationName = data.organizationName ?? undefined;
    this.teamIds = data.teamIds ?? undefined;
    this.teamNames = data.teamNames ?? undefined;
    this.userCount = data.userCount ?? undefined;
  }

  /** Avatar URLs for the invitees. */
  public avatarURLs?: string[];
  /** The name of the inviter. */
  public inviterName?: string;
  /** The domain of the organization the users were invited to. */
  public organizationDomain?: string;
  /** The logo of the organization the users were invited to. */
  public organizationLogoUrl?: string;
  /** The name of the organization the users were invited to. */
  public organizationName?: string;
  /** Team identifiers for the invitees. */
  public teamIds?: string[];
  /** Team names for the invitees. */
  public teamNames?: string[];
  /** The user count of the organization. */
  public userCount?: number;
}
/**
 * InvitePagePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.InvitePagePayloadFragment response data
 */
export class InvitePagePayload extends LinearRequest {
  public constructor(request: Request, data: L.InvitePagePayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
    this.inviteData = data.inviteData ? new InviteData(request, data.inviteData) : undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
  /** Invite data. */
  public inviteData?: InviteData;
}
/**
 * Invoice model
 *
 * @param request - function to call the graphql client
 * @param data - L.InvoiceFragment response data
 */
export class Invoice extends LinearRequest {
  public constructor(request: Request, data: L.InvoiceFragment) {
    super(request);
    this.created = data.created ?? undefined;
    this.dueDate = data.dueDate ?? undefined;
    this.status = data.status ?? undefined;
    this.total = data.total ?? undefined;
    this.url = data.url ?? undefined;
  }

  /** The creation date of the invoice. */
  public created?: L.Scalars["TimelessDateScalar"];
  /** The due date of the invoice. */
  public dueDate?: L.Scalars["TimelessDateScalar"];
  /** The status of the invoice. */
  public status?: string;
  /** The invoice total, in cents. */
  public total?: number;
  /** The URL at which the invoice can be viewed or paid. */
  public url?: string;
}
/**
 * An issue.
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueFragment response data
 */
export class Issue extends LinearRequest {
  private _assignee?: L.IssueFragment["assignee"];
  private _creator?: L.IssueFragment["creator"];
  private _cycle?: L.IssueFragment["cycle"];
  private _parent?: L.IssueFragment["parent"];
  private _project?: L.IssueFragment["project"];
  private _state?: L.IssueFragment["state"];
  private _team?: L.IssueFragment["team"];

  public constructor(request: Request, data: L.IssueFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.autoArchivedAt = data.autoArchivedAt ?? undefined;
    this.autoClosedAt = data.autoClosedAt ?? undefined;
    this.boardOrder = data.boardOrder ?? undefined;
    this.branchName = data.branchName ?? undefined;
    this.canceledAt = data.canceledAt ?? undefined;
    this.completedAt = data.completedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.dueDate = data.dueDate ?? undefined;
    this.estimate = data.estimate ?? undefined;
    this.id = data.id ?? undefined;
    this.identifier = data.identifier ?? undefined;
    this.number = data.number ?? undefined;
    this.previousIdentifiers = data.previousIdentifiers ?? undefined;
    this.priority = data.priority ?? undefined;
    this.priorityLabel = data.priorityLabel ?? undefined;
    this.startedAt = data.startedAt ?? undefined;
    this.subIssueSortOrder = data.subIssueSortOrder ?? undefined;
    this.title = data.title ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.url = data.url ?? undefined;
    this._assignee = data.assignee ?? undefined;
    this._creator = data.creator ?? undefined;
    this._cycle = data.cycle ?? undefined;
    this._parent = data.parent ?? undefined;
    this._project = data.project ?? undefined;
    this._state = data.state ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the issue was automatically archived by the auto pruning process. */
  public autoArchivedAt?: L.Scalars["DateTime"];
  /** The time at which the issue was automatically closed by the auto pruning process. */
  public autoClosedAt?: L.Scalars["DateTime"];
  /** The order of the item in its column on the board. */
  public boardOrder?: number;
  /** Suggested branch name for the issue. */
  public branchName?: string;
  /** The time at which the issue was moved into canceled state. */
  public canceledAt?: L.Scalars["DateTime"];
  /** The time at which the issue was moved into completed state. */
  public completedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The issue's description in markdown format. */
  public description?: string;
  /** The date at which the issue is due. */
  public dueDate?: L.Scalars["TimelessDateScalar"];
  /** The estimate of the complexity of the issue.. */
  public estimate?: number;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Issue's human readable identifier (e.g. ENG-123). */
  public identifier?: string;
  /** The issue's unique number. */
  public number?: number;
  /** Previous identifiers of the issue if it has been moved between teams. */
  public previousIdentifiers?: string[];
  /** The priority of the issue. */
  public priority?: number;
  /** Label for the priority. */
  public priorityLabel?: string;
  /** The time at which the issue was moved into started state. */
  public startedAt?: L.Scalars["DateTime"];
  /** The order of the item in the sub-issue list. Only set if the issue has a parent. */
  public subIssueSortOrder?: number;
  /** The issue's title. */
  public title?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Issue URL. */
  public url?: string;
  /** The user to whom the issue is assigned to. */
  public get assignee(): Fetch<User> | undefined {
    return this._assignee?.id ? new UserQuery(this._request).fetch(this._assignee?.id) : undefined;
  }
  /** The user who created the issue. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The cycle that the issue is associated with. */
  public get cycle(): Fetch<Cycle> | undefined {
    return this._cycle?.id ? new CycleQuery(this._request).fetch(this._cycle?.id) : undefined;
  }
  /** The parent of the issue. */
  public get parent(): Fetch<Issue> | undefined {
    return this._parent?.id ? new IssueQuery(this._request).fetch(this._parent?.id) : undefined;
  }
  /** The project that the issue is associated with. */
  public get project(): Fetch<Project> | undefined {
    return this._project?.id ? new ProjectQuery(this._request).fetch(this._project?.id) : undefined;
  }
  /** The workflow state that the issue is associated with. */
  public get state(): Fetch<WorkflowState> | undefined {
    return this._state?.id ? new WorkflowStateQuery(this._request).fetch(this._state?.id) : undefined;
  }
  /** The team that the issue is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** Children of the issue. */
  public children(variables?: Omit<L.Issue_ChildrenQueryVariables, "id">) {
    return this.id ? new Issue_ChildrenQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Comments associated with the issue. */
  public comments(variables?: Omit<L.Issue_CommentsQueryVariables, "id">) {
    return this.id ? new Issue_CommentsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** History entries associated with the issue. */
  public history(variables?: Omit<L.Issue_HistoryQueryVariables, "id">) {
    return this.id ? new Issue_HistoryQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Integration resources for this issue. */
  public integrationResources(variables?: Omit<L.Issue_IntegrationResourcesQueryVariables, "id">) {
    return this.id ? new Issue_IntegrationResourcesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Inverse relations associated with this issue. */
  public inverseRelations(variables?: Omit<L.Issue_InverseRelationsQueryVariables, "id">) {
    return this.id ? new Issue_InverseRelationsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Labels associated with this issue. */
  public labels(variables?: Omit<L.Issue_LabelsQueryVariables, "id">) {
    return this.id ? new Issue_LabelsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Relations associated with this issue. */
  public relations(variables?: Omit<L.Issue_RelationsQueryVariables, "id">) {
    return this.id ? new Issue_RelationsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Users who are subscribed to the issue. */
  public subscribers(variables?: Omit<L.Issue_SubscribersQueryVariables, "id">) {
    return this.id ? new Issue_SubscribersQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * IssueConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this IssueConnection model
 * @param data - IssueConnection response data
 */
export class IssueConnection extends LinearConnection<Issue> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Issue>>,
    data: L.IssueConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Issue(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * A record of changes to an issue.
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueHistoryFragment response data
 */
export class IssueHistory extends LinearRequest {
  private _actor?: L.IssueHistoryFragment["actor"];
  private _fromAssignee?: L.IssueHistoryFragment["fromAssignee"];
  private _fromCycle?: L.IssueHistoryFragment["fromCycle"];
  private _fromParent?: L.IssueHistoryFragment["fromParent"];
  private _fromProject?: L.IssueHistoryFragment["fromProject"];
  private _fromState?: L.IssueHistoryFragment["fromState"];
  private _fromTeam?: L.IssueHistoryFragment["fromTeam"];
  private _issue?: L.IssueHistoryFragment["issue"];
  private _toAssignee?: L.IssueHistoryFragment["toAssignee"];
  private _toCycle?: L.IssueHistoryFragment["toCycle"];
  private _toParent?: L.IssueHistoryFragment["toParent"];
  private _toProject?: L.IssueHistoryFragment["toProject"];
  private _toState?: L.IssueHistoryFragment["toState"];
  private _toTeam?: L.IssueHistoryFragment["toTeam"];

  public constructor(request: Request, data: L.IssueHistoryFragment) {
    super(request);
    this.addedLabelIds = data.addedLabelIds ?? undefined;
    this.archived = data.archived ?? undefined;
    this.archivedAt = data.archivedAt ?? undefined;
    this.autoArchived = data.autoArchived ?? undefined;
    this.autoClosed = data.autoClosed ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.fromDueDate = data.fromDueDate ?? undefined;
    this.fromEstimate = data.fromEstimate ?? undefined;
    this.fromPriority = data.fromPriority ?? undefined;
    this.fromTitle = data.fromTitle ?? undefined;
    this.id = data.id ?? undefined;
    this.relationChanges = data.relationChanges ?? undefined;
    this.removedLabelIds = data.removedLabelIds ?? undefined;
    this.source = data.source ?? undefined;
    this.toDueDate = data.toDueDate ?? undefined;
    this.toEstimate = data.toEstimate ?? undefined;
    this.toPriority = data.toPriority ?? undefined;
    this.toTitle = data.toTitle ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.updatedDescription = data.updatedDescription ?? undefined;
    this._actor = data.actor ?? undefined;
    this._fromAssignee = data.fromAssignee ?? undefined;
    this._fromCycle = data.fromCycle ?? undefined;
    this._fromParent = data.fromParent ?? undefined;
    this._fromProject = data.fromProject ?? undefined;
    this._fromState = data.fromState ?? undefined;
    this._fromTeam = data.fromTeam ?? undefined;
    this._issue = data.issue ?? undefined;
    this._toAssignee = data.toAssignee ?? undefined;
    this._toCycle = data.toCycle ?? undefined;
    this._toParent = data.toParent ?? undefined;
    this._toProject = data.toProject ?? undefined;
    this._toState = data.toState ?? undefined;
    this._toTeam = data.toTeam ?? undefined;
  }

  /** ID's of labels that were added. */
  public addedLabelIds?: string[];
  /** Whether the issue was archived or un-archived. */
  public archived?: boolean;
  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  public autoArchived?: boolean;
  public autoClosed?: boolean;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** What the due date was changed from */
  public fromDueDate?: L.Scalars["TimelessDateScalar"];
  /** What the estimate was changed from. */
  public fromEstimate?: number;
  /** What the priority was changed from. */
  public fromPriority?: number;
  /** What the title was changed from. */
  public fromTitle?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Changed issue relationships. */
  public relationChanges?: string[];
  /** ID's of labels that were removed. */
  public removedLabelIds?: string[];
  /** Information about the integration or application which created this history entry. */
  public source?: L.Scalars["JSONObject"];
  /** What the due date was changed to */
  public toDueDate?: L.Scalars["TimelessDateScalar"];
  /** What the estimate was changed to. */
  public toEstimate?: number;
  /** What the priority was changed to. */
  public toPriority?: number;
  /** What the title was changed to. */
  public toTitle?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Whether the issue's description was updated. */
  public updatedDescription?: boolean;
  /** The user who made these changes. If null, possibly means that the change made by an integration. */
  public get actor(): Fetch<User> | undefined {
    return this._actor?.id ? new UserQuery(this._request).fetch(this._actor?.id) : undefined;
  }
  /** The user from whom the issue was re-assigned from. */
  public get fromAssignee(): Fetch<User> | undefined {
    return this._fromAssignee?.id ? new UserQuery(this._request).fetch(this._fromAssignee?.id) : undefined;
  }
  /** The previous cycle of the issue. */
  public get fromCycle(): Fetch<Cycle> | undefined {
    return this._fromCycle?.id ? new CycleQuery(this._request).fetch(this._fromCycle?.id) : undefined;
  }
  /** The previous parent of the issue. */
  public get fromParent(): Fetch<Issue> | undefined {
    return this._fromParent?.id ? new IssueQuery(this._request).fetch(this._fromParent?.id) : undefined;
  }
  /** The previous project of the issue. */
  public get fromProject(): Fetch<Project> | undefined {
    return this._fromProject?.id ? new ProjectQuery(this._request).fetch(this._fromProject?.id) : undefined;
  }
  /** The previous workflow state of the issue. */
  public get fromState(): Fetch<WorkflowState> | undefined {
    return this._fromState?.id ? new WorkflowStateQuery(this._request).fetch(this._fromState?.id) : undefined;
  }
  /** The team from which the issue was moved from. */
  public get fromTeam(): Fetch<Team> | undefined {
    return this._fromTeam?.id ? new TeamQuery(this._request).fetch(this._fromTeam?.id) : undefined;
  }
  /** The issue that was changed. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
  /** The user to whom the issue was assigned to. */
  public get toAssignee(): Fetch<User> | undefined {
    return this._toAssignee?.id ? new UserQuery(this._request).fetch(this._toAssignee?.id) : undefined;
  }
  /** The new cycle of the issue. */
  public get toCycle(): Fetch<Cycle> | undefined {
    return this._toCycle?.id ? new CycleQuery(this._request).fetch(this._toCycle?.id) : undefined;
  }
  /** The new parent of the issue. */
  public get toParent(): Fetch<Issue> | undefined {
    return this._toParent?.id ? new IssueQuery(this._request).fetch(this._toParent?.id) : undefined;
  }
  /** The new project of the issue. */
  public get toProject(): Fetch<Project> | undefined {
    return this._toProject?.id ? new ProjectQuery(this._request).fetch(this._toProject?.id) : undefined;
  }
  /** The new workflow state of the issue. */
  public get toState(): Fetch<WorkflowState> | undefined {
    return this._toState?.id ? new WorkflowStateQuery(this._request).fetch(this._toState?.id) : undefined;
  }
  /** The team to which the issue was moved to. */
  public get toTeam(): Fetch<Team> | undefined {
    return this._toTeam?.id ? new TeamQuery(this._request).fetch(this._toTeam?.id) : undefined;
  }
}
/**
 * IssueHistoryConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this IssueHistoryConnection model
 * @param data - IssueHistoryConnection response data
 */
export class IssueHistoryConnection extends LinearConnection<IssueHistory> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<IssueHistory>>,
    data: L.IssueHistoryConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new IssueHistory(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * An import job for data from an external service
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueImportFragment response data
 */
export class IssueImport extends LinearRequest {
  public constructor(request: Request, data: L.IssueImportFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.creatorId = data.creatorId ?? undefined;
    this.id = data.id ?? undefined;
    this.service = data.service ?? undefined;
    this.status = data.status ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The id for the user that started the job. */
  public creatorId?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The service from which data will be imported. */
  public service?: string;
  /** The status for the import job. */
  public status?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
}
/**
 * IssueImportPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueImportPayloadFragment response data
 */
export class IssueImportPayload extends LinearRequest {
  public constructor(request: Request, data: L.IssueImportPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.issueImport = data.issueImport ? new IssueImport(request, data.issueImport) : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The import job that was created or updated. */
  public issueImport?: IssueImport;
}
/**
 * Labels that can be associated with issues.
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueLabelFragment response data
 */
export class IssueLabel extends LinearRequest {
  private _creator?: L.IssueLabelFragment["creator"];
  private _team?: L.IssueLabelFragment["team"];

  public constructor(request: Request, data: L.IssueLabelFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.color = data.color ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._creator = data.creator ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The label's color as a HEX string. */
  public color?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The label's description. */
  public description?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The label's name. */
  public name?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user who created the label. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The team to which the label belongs to. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** Issues associated with the label. */
  public issues(variables?: Omit<L.IssueLabel_IssuesQueryVariables, "id">) {
    return this.id ? new IssueLabel_IssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * IssueLabelConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this IssueLabelConnection model
 * @param data - IssueLabelConnection response data
 */
export class IssueLabelConnection extends LinearConnection<IssueLabel> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<IssueLabel>>,
    data: L.IssueLabelConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new IssueLabel(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * IssueLabelPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueLabelPayloadFragment response data
 */
export class IssueLabelPayload extends LinearRequest {
  private _issueLabel?: L.IssueLabelPayloadFragment["issueLabel"];

  public constructor(request: Request, data: L.IssueLabelPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._issueLabel = data.issueLabel ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The label that was created or updated. */
  public get issueLabel(): Fetch<IssueLabel> | undefined {
    return this._issueLabel?.id ? new IssueLabelQuery(this._request).fetch(this._issueLabel?.id) : undefined;
  }
}
/**
 * IssuePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.IssuePayloadFragment response data
 */
export class IssuePayload extends LinearRequest {
  private _issue?: L.IssuePayloadFragment["issue"];

  public constructor(request: Request, data: L.IssuePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._issue = data.issue ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The issue that was created or updated. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
}
/**
 * A relation between two issues.
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueRelationFragment response data
 */
export class IssueRelation extends LinearRequest {
  private _issue?: L.IssueRelationFragment["issue"];
  private _relatedIssue?: L.IssueRelationFragment["relatedIssue"];

  public constructor(request: Request, data: L.IssueRelationFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._issue = data.issue ?? undefined;
    this._relatedIssue = data.relatedIssue ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The relationship of the issue with the related issue. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The issue whose relationship is being described. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
  /** The related issue. */
  public get relatedIssue(): Fetch<Issue> | undefined {
    return this._relatedIssue?.id ? new IssueQuery(this._request).fetch(this._relatedIssue?.id) : undefined;
  }
}
/**
 * IssueRelationConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this IssueRelationConnection model
 * @param data - IssueRelationConnection response data
 */
export class IssueRelationConnection extends LinearConnection<IssueRelation> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<IssueRelation>>,
    data: L.IssueRelationConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new IssueRelation(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * IssueRelationPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.IssueRelationPayloadFragment response data
 */
export class IssueRelationPayload extends LinearRequest {
  private _issueRelation?: L.IssueRelationPayloadFragment["issueRelation"];

  public constructor(request: Request, data: L.IssueRelationPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._issueRelation = data.issueRelation ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The issue relation that was created or updated. */
  public get issueRelation(): Fetch<IssueRelation> | undefined {
    return this._issueRelation?.id ? new IssueRelationQuery(this._request).fetch(this._issueRelation?.id) : undefined;
  }
}
/**
 * A milestone that contains projects.
 *
 * @param request - function to call the graphql client
 * @param data - L.MilestoneFragment response data
 */
export class Milestone extends LinearRequest {
  public constructor(request: Request, data: L.MilestoneFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.sortOrder = data.sortOrder ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The name of the milestone. */
  public name?: string;
  /** The sort order for the milestone. */
  public sortOrder?: number;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The organization that the milestone belongs to. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /** Projects associated with the milestone. */
  public projects(variables?: Omit<L.Milestone_ProjectsQueryVariables, "id">) {
    return this.id ? new Milestone_ProjectsQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * MilestoneConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this MilestoneConnection model
 * @param data - MilestoneConnection response data
 */
export class MilestoneConnection extends LinearConnection<Milestone> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Milestone>>,
    data: L.MilestoneConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Milestone(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * MilestonePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.MilestonePayloadFragment response data
 */
export class MilestonePayload extends LinearRequest {
  private _milestone?: L.MilestonePayloadFragment["milestone"];

  public constructor(request: Request, data: L.MilestonePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._milestone = data.milestone ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The milesteone that was created or updated. */
  public get milestone(): Fetch<Milestone> | undefined {
    return this._milestone?.id ? new MilestoneQuery(this._request).fetch(this._milestone?.id) : undefined;
  }
}
/**
 * A notification sent to a user.
 *
 * @param request - function to call the graphql client
 * @param data - L.NotificationFragment response data
 */
export class Notification extends LinearRequest {
  private _comment?: L.NotificationFragment["comment"];
  private _issue?: L.NotificationFragment["issue"];
  private _team?: L.NotificationFragment["team"];
  private _user?: L.NotificationFragment["user"];

  public constructor(request: Request, data: L.NotificationFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.emailedAt = data.emailedAt ?? undefined;
    this.id = data.id ?? undefined;
    this.reactionEmoji = data.reactionEmoji ?? undefined;
    this.readAt = data.readAt ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._comment = data.comment ?? undefined;
    this._issue = data.issue ?? undefined;
    this._team = data.team ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /**
   * The time at when an email reminder for this notification was sent to the user. Null, if no email
   *     reminder has been sent.
   */
  public emailedAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** Name of the reaction emoji associated with the notification. */
  public reactionEmoji?: string;
  /** The time at when the user marked the notification as read. Null, if the the user hasn't read the notification */
  public readAt?: L.Scalars["DateTime"];
  /** Notification type */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The comment which the notification is associated with. */
  public get comment(): Fetch<Comment> | undefined {
    return this._comment?.id ? new CommentQuery(this._request).fetch(this._comment?.id) : undefined;
  }
  /** The issue that the notification is associated with. */
  public get issue(): Fetch<Issue> | undefined {
    return this._issue?.id ? new IssueQuery(this._request).fetch(this._issue?.id) : undefined;
  }
  /** The team which the notification is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** The recipient of the notification. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * NotificationConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this NotificationConnection model
 * @param data - NotificationConnection response data
 */
export class NotificationConnection extends LinearConnection<Notification> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Notification>>,
    data: L.NotificationConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Notification(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * NotificationPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.NotificationPayloadFragment response data
 */
export class NotificationPayload extends LinearRequest {
  private _notification?: L.NotificationPayloadFragment["notification"];

  public constructor(request: Request, data: L.NotificationPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._notification = data.notification ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The notification that was created or updated. */
  public get notification(): Fetch<Notification> | undefined {
    return this._notification?.id ? new NotificationQuery(this._request).fetch(this._notification?.id) : undefined;
  }
}
/**
 * Notification subscriptions for models.
 *
 * @param request - function to call the graphql client
 * @param data - L.NotificationSubscriptionFragment response data
 */
export class NotificationSubscription extends LinearRequest {
  private _project?: L.NotificationSubscriptionFragment["project"];
  private _team?: L.NotificationSubscriptionFragment["team"];
  private _user?: L.NotificationSubscriptionFragment["user"];

  public constructor(request: Request, data: L.NotificationSubscriptionFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._project = data.project ?? undefined;
    this._team = data.team ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The type of the subscription. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Subscribed project. */
  public get project(): Fetch<Project> | undefined {
    return this._project?.id ? new ProjectQuery(this._request).fetch(this._project?.id) : undefined;
  }
  /** Subscribed team. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** The user associated with notification subscriptions. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * NotificationSubscriptionConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this NotificationSubscriptionConnection model
 * @param data - NotificationSubscriptionConnection response data
 */
export class NotificationSubscriptionConnection extends LinearConnection<NotificationSubscription> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<NotificationSubscription>>,
    data: L.NotificationSubscriptionConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new NotificationSubscription(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * NotificationSubscriptionPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.NotificationSubscriptionPayloadFragment response data
 */
export class NotificationSubscriptionPayload extends LinearRequest {
  private _notificationSubscription?: L.NotificationSubscriptionPayloadFragment["notificationSubscription"];

  public constructor(request: Request, data: L.NotificationSubscriptionPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._notificationSubscription = data.notificationSubscription ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The notification subscription that was created or updated. */
  public get notificationSubscription(): Fetch<NotificationSubscription> | undefined {
    return this._notificationSubscription?.id
      ? new NotificationSubscriptionQuery(this._request).fetch(this._notificationSubscription?.id)
      : undefined;
  }
}
/**
 * OAuth2 client application
 *
 * @param request - function to call the graphql client
 * @param data - L.OauthClientFragment response data
 */
export class OauthClient extends LinearRequest {
  public constructor(request: Request, data: L.OauthClientFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.clientId = data.clientId ?? undefined;
    this.clientSecret = data.clientSecret ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.developer = data.developer ?? undefined;
    this.developerUrl = data.developerUrl ?? undefined;
    this.id = data.id ?? undefined;
    this.imageUrl = data.imageUrl ?? undefined;
    this.name = data.name ?? undefined;
    this.redirectUris = data.redirectUris ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** OAuth application's client ID. */
  public clientId?: string;
  /** OAuth application's client secret. */
  public clientSecret?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Information about the application. */
  public description?: string;
  /** Name of the developer. */
  public developer?: string;
  /** Url of the developer. */
  public developerUrl?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Image of the application. */
  public imageUrl?: string;
  /** OAuth application's client name. */
  public name?: string;
  /** List of allowed redirect URIs for the application. */
  public redirectUris?: string[];
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
}
/**
 * OauthClientPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OauthClientPayloadFragment response data
 */
export class OauthClientPayload extends LinearRequest {
  public constructor(request: Request, data: L.OauthClientPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.oauthClient = data.oauthClient ? new OauthClient(request, data.oauthClient) : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The OAuth client application that was created or updated. */
  public oauthClient?: OauthClient;
}
/**
 * OauthTokenRevokePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OauthTokenRevokePayloadFragment response data
 */
export class OauthTokenRevokePayload extends LinearRequest {
  public constructor(request: Request, data: L.OauthTokenRevokePayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * An organization. Organizations are root-level objects that contain user accounts and teams.
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationFragment response data
 */
export class Organization extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationFragment) {
    super(request);
    this.allowedAuthServices = data.allowedAuthServices ?? undefined;
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.createdIssueCount = data.createdIssueCount ?? undefined;
    this.gitLinkbackMessagesEnabled = data.gitLinkbackMessagesEnabled ?? undefined;
    this.gitPublicLinkbackMessagesEnabled = data.gitPublicLinkbackMessagesEnabled ?? undefined;
    this.id = data.id ?? undefined;
    this.logoUrl = data.logoUrl ?? undefined;
    this.name = data.name ?? undefined;
    this.periodUploadVolume = data.periodUploadVolume ?? undefined;
    this.roadmapEnabled = data.roadmapEnabled ?? undefined;
    this.samlEnabled = data.samlEnabled ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.urlKey = data.urlKey ?? undefined;
    this.userCount = data.userCount ?? undefined;
  }

  /** Allowed authentication providers, empty array means all are allowed */
  public allowedAuthServices?: string[];
  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Number of issues in the organization. */
  public createdIssueCount?: number;
  /** Whether the Git integration linkback messages should be sent to private repositories. */
  public gitLinkbackMessagesEnabled?: boolean;
  /** Whether the Git integration linkback messages should be sent to public repositories. */
  public gitPublicLinkbackMessagesEnabled?: boolean;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The organization's logo URL. */
  public logoUrl?: string;
  /** The organization's name. */
  public name?: string;
  /** Rolling 30-day total upload volume for the organization, in megabytes. */
  public periodUploadVolume?: number;
  /** Whether the organization is using a roadmap. */
  public roadmapEnabled?: boolean;
  /** Whether SAML authentication is enabled for organization. */
  public samlEnabled?: boolean;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The organization's unique URL key. */
  public urlKey?: string;
  /** Number of active users in the organization. */
  public userCount?: number;

  /** Integrations associated with the organization. */
  public integrations(variables?: L.Organization_IntegrationsQueryVariables) {
    return new Organization_IntegrationsQuery(this._request).fetch(variables);
  }
  /** Milestones associated with the organization. */
  public milestones(variables?: L.Organization_MilestonesQueryVariables) {
    return new Organization_MilestonesQuery(this._request).fetch(variables);
  }
  /** Teams associated with the organization. */
  public teams(variables?: L.Organization_TeamsQueryVariables) {
    return new Organization_TeamsQuery(this._request).fetch(variables);
  }
  /** Users associated with the organization. */
  public users(variables?: L.Organization_UsersQueryVariables) {
    return new Organization_UsersQuery(this._request).fetch(variables);
  }
}
/**
 * OrganizationDeletePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationDeletePayloadFragment response data
 */
export class OrganizationDeletePayload extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationDeletePayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * Defines the use of a domain by an organization.
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationDomainFragment response data
 */
export class OrganizationDomain extends LinearRequest {
  private _creator?: L.OrganizationDomainFragment["creator"];

  public constructor(request: Request, data: L.OrganizationDomainFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.verificationEmail = data.verificationEmail ?? undefined;
    this.verified = data.verified ?? undefined;
    this._creator = data.creator ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** Domain name */
  public name?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** E-mail used to verify this domain */
  public verificationEmail?: string;
  /** Is this domain verified */
  public verified?: boolean;
  /** The user who added the domain. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
}
/**
 * OrganizationDomainPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationDomainPayloadFragment response data
 */
export class OrganizationDomainPayload extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationDomainPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.organizationDomain = data.organizationDomain
      ? new OrganizationDomain(request, data.organizationDomain)
      : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The organization domain that was created or updated. */
  public organizationDomain?: OrganizationDomain;
}
/**
 * OrganizationDomainSimplePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationDomainSimplePayloadFragment response data
 */
export class OrganizationDomainSimplePayload extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationDomainSimplePayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * OrganizationExistsPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationExistsPayloadFragment response data
 */
export class OrganizationExistsPayload extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationExistsPayloadFragment) {
    super(request);
    this.exists = data.exists ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** Whether the organization exists. */
  public exists?: boolean;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * An invitation to the organization that has been sent via email.
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationInviteFragment response data
 */
export class OrganizationInvite extends LinearRequest {
  private _invitee?: L.OrganizationInviteFragment["invitee"];
  private _inviter?: L.OrganizationInviteFragment["inviter"];

  public constructor(request: Request, data: L.OrganizationInviteFragment) {
    super(request);
    this.acceptedAt = data.acceptedAt ?? undefined;
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.email = data.email ?? undefined;
    this.expiresAt = data.expiresAt ?? undefined;
    this.external = data.external ?? undefined;
    this.id = data.id ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._invitee = data.invitee ?? undefined;
    this._inviter = data.inviter ?? undefined;
  }

  /** The time at which the invite was accepted. Null, if the invite hasn't been accepted */
  public acceptedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The invitees email address. */
  public email?: string;
  /** The time at which the invite will be expiring. Null, if the invite shouldn't expire */
  public expiresAt?: L.Scalars["DateTime"];
  /** The invite was sent to external address. */
  public external?: boolean;
  /** The unique identifier of the entity. */
  public id?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user who has accepted the invite. Null, if the invite hasn't been accepted. */
  public get invitee(): Fetch<User> | undefined {
    return this._invitee?.id ? new UserQuery(this._request).fetch(this._invitee?.id) : undefined;
  }
  /** The user who created the invitation. */
  public get inviter(): Fetch<User> | undefined {
    return this._inviter?.id ? new UserQuery(this._request).fetch(this._inviter?.id) : undefined;
  }
  /** The organization that the invite is associated with. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /** undefined */
  public issues(variables?: Omit<L.OrganizationInvite_IssuesQueryVariables, "id">) {
    return this.id ? new OrganizationInvite_IssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * OrganizationInviteConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this OrganizationInviteConnection model
 * @param data - OrganizationInviteConnection response data
 */
export class OrganizationInviteConnection extends LinearConnection<OrganizationInvite> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<OrganizationInvite>>,
    data: L.OrganizationInviteConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new OrganizationInvite(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * OrganizationInvitePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationInvitePayloadFragment response data
 */
export class OrganizationInvitePayload extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationInvitePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.organizationInvite = data.organizationInvite
      ? new OrganizationInvite(request, data.organizationInvite)
      : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The organization invite that was created or updated. */
  public organizationInvite?: OrganizationInvite;
}
/**
 * OrganizationPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.OrganizationPayloadFragment response data
 */
export class OrganizationPayload extends LinearRequest {
  public constructor(request: Request, data: L.OrganizationPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The organization that was created or updated. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
}
/**
 * PageInfo model
 *
 * @param request - function to call the graphql client
 * @param data - L.PageInfoFragment response data
 */
export class PageInfo extends LinearRequest {
  public constructor(request: Request, data: L.PageInfoFragment) {
    super(request);
    this.endCursor = data.endCursor ?? undefined;
    this.hasNextPage = data.hasNextPage ?? undefined;
    this.hasPreviousPage = data.hasPreviousPage ?? undefined;
    this.startCursor = data.startCursor ?? undefined;
  }

  /** Cursor representing the last result in the paginated results. */
  public endCursor?: string;
  /** Indicates if there are more results when paginating forward. */
  public hasNextPage?: boolean;
  /** Indicates if there are more results when paginating backward. */
  public hasPreviousPage?: boolean;
  /** Cursor representing the first result in the paginated results. */
  public startCursor?: string;
}
/**
 * A project.
 *
 * @param request - function to call the graphql client
 * @param data - L.ProjectFragment response data
 */
export class Project extends LinearRequest {
  private _creator?: L.ProjectFragment["creator"];
  private _lead?: L.ProjectFragment["lead"];
  private _milestone?: L.ProjectFragment["milestone"];

  public constructor(request: Request, data: L.ProjectFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.canceledAt = data.canceledAt ?? undefined;
    this.color = data.color ?? undefined;
    this.completedAt = data.completedAt ?? undefined;
    this.completedIssueCountHistory = data.completedIssueCountHistory ?? undefined;
    this.completedScopeHistory = data.completedScopeHistory ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.icon = data.icon ?? undefined;
    this.id = data.id ?? undefined;
    this.issueCountHistory = data.issueCountHistory ?? undefined;
    this.name = data.name ?? undefined;
    this.scopeHistory = data.scopeHistory ?? undefined;
    this.slackIssueComments = data.slackIssueComments ?? undefined;
    this.slackIssueStatuses = data.slackIssueStatuses ?? undefined;
    this.slackNewIssue = data.slackNewIssue ?? undefined;
    this.slugId = data.slugId ?? undefined;
    this.sortOrder = data.sortOrder ?? undefined;
    this.startedAt = data.startedAt ?? undefined;
    this.state = data.state ?? undefined;
    this.targetDate = data.targetDate ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._creator = data.creator ?? undefined;
    this._lead = data.lead ?? undefined;
    this._milestone = data.milestone ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the project was moved into canceled state. */
  public canceledAt?: L.Scalars["DateTime"];
  /** The project's color. */
  public color?: string;
  /** The time at which the project was moved into completed state. */
  public completedAt?: L.Scalars["DateTime"];
  /** The number of completed issues in the project after each week. */
  public completedIssueCountHistory?: number[];
  /** The number of completed estimation points after each week. */
  public completedScopeHistory?: number[];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The project's description. */
  public description?: string;
  /** The icon of the project. */
  public icon?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The total number of issues in the project after each week. */
  public issueCountHistory?: number[];
  /** The project's name. */
  public name?: string;
  /** The total number of estimation points after each week. */
  public scopeHistory?: number[];
  /** Whether to send new issue comment notifications to Slack. */
  public slackIssueComments?: boolean;
  /** Whether to send new issue status updates to Slack. */
  public slackIssueStatuses?: boolean;
  /** Whether to send new issue notifications to Slack. */
  public slackNewIssue?: boolean;
  /** The project's unique URL slug. */
  public slugId?: string;
  /** The sort order for the project within its milestone. */
  public sortOrder?: number;
  /** The time at which the project was moved into started state. */
  public startedAt?: L.Scalars["DateTime"];
  /** The type of the state. */
  public state?: string;
  /** The estimated completion date of the project. */
  public targetDate?: L.Scalars["TimelessDateScalar"];
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user who created the project. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The project lead. */
  public get lead(): Fetch<User> | undefined {
    return this._lead?.id ? new UserQuery(this._request).fetch(this._lead?.id) : undefined;
  }
  /** The milestone that this project is associated with. */
  public get milestone(): Fetch<Milestone> | undefined {
    return this._milestone?.id ? new MilestoneQuery(this._request).fetch(this._milestone?.id) : undefined;
  }
  /** Issues associated with the project. */
  public issues(variables?: Omit<L.Project_IssuesQueryVariables, "id">) {
    return this.id ? new Project_IssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Links associated with the project. */
  public links(variables?: Omit<L.Project_LinksQueryVariables, "id">) {
    return this.id ? new Project_LinksQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Users that are members of the project. */
  public members(variables?: Omit<L.Project_MembersQueryVariables, "id">) {
    return this.id ? new Project_MembersQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Teams associated with this project. */
  public teams(variables?: Omit<L.Project_TeamsQueryVariables, "id">) {
    return this.id ? new Project_TeamsQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * ProjectConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this ProjectConnection model
 * @param data - ProjectConnection response data
 */
export class ProjectConnection extends LinearConnection<Project> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Project>>,
    data: L.ProjectConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Project(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * An external link for a project.
 *
 * @param request - function to call the graphql client
 * @param data - L.ProjectLinkFragment response data
 */
export class ProjectLink extends LinearRequest {
  private _creator?: L.ProjectLinkFragment["creator"];
  private _project?: L.ProjectLinkFragment["project"];

  public constructor(request: Request, data: L.ProjectLinkFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.label = data.label ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.url = data.url ?? undefined;
    this._creator = data.creator ?? undefined;
    this._project = data.project ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The link's label. */
  public label?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The link's URL. */
  public url?: string;
  /** The user who created the link. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The project that the link is associated with. */
  public get project(): Fetch<Project> | undefined {
    return this._project?.id ? new ProjectQuery(this._request).fetch(this._project?.id) : undefined;
  }
}
/**
 * ProjectLinkConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this ProjectLinkConnection model
 * @param data - ProjectLinkConnection response data
 */
export class ProjectLinkConnection extends LinearConnection<ProjectLink> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<ProjectLink>>,
    data: L.ProjectLinkConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new ProjectLink(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * ProjectLinkPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ProjectLinkPayloadFragment response data
 */
export class ProjectLinkPayload extends LinearRequest {
  private _projectLink?: L.ProjectLinkPayloadFragment["projectLink"];

  public constructor(request: Request, data: L.ProjectLinkPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._projectLink = data.projectLink ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The project that was created or updated. */
  public get projectLink(): Fetch<ProjectLink> | undefined {
    return this._projectLink?.id ? new ProjectLinkQuery(this._request).fetch(this._projectLink?.id) : undefined;
  }
}
/**
 * ProjectPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ProjectPayloadFragment response data
 */
export class ProjectPayload extends LinearRequest {
  private _project?: L.ProjectPayloadFragment["project"];

  public constructor(request: Request, data: L.ProjectPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._project = data.project ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The project that was created or updated. */
  public get project(): Fetch<Project> | undefined {
    return this._project?.id ? new ProjectQuery(this._request).fetch(this._project?.id) : undefined;
  }
}
/**
 * Pull request data
 *
 * @param request - function to call the graphql client
 * @param data - L.PullRequestPayloadFragment response data
 */
export class PullRequestPayload extends LinearRequest {
  public constructor(request: Request, data: L.PullRequestPayloadFragment) {
    super(request);
    this.branch = data.branch ?? undefined;
    this.closedAt = data.closedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.draft = data.draft ?? undefined;
    this.id = data.id ?? undefined;
    this.mergedAt = data.mergedAt ?? undefined;
    this.number = data.number ?? undefined;
    this.repoLogin = data.repoLogin ?? undefined;
    this.repoName = data.repoName ?? undefined;
    this.status = data.status ?? undefined;
    this.title = data.title ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.url = data.url ?? undefined;
    this.userId = data.userId ?? undefined;
    this.userLogin = data.userLogin ?? undefined;
  }

  public branch?: string;
  public closedAt?: string;
  public createdAt?: string;
  public draft?: boolean;
  public id?: string;
  public mergedAt?: string;
  public number?: number;
  public repoLogin?: string;
  public repoName?: string;
  public status?: string;
  public title?: string;
  public updatedAt?: string;
  public url?: string;
  public userId?: string;
  public userLogin?: string;
}
/**
 * A user's web browser push notification subscription.
 *
 * @param request - function to call the graphql client
 * @param data - L.PushSubscriptionFragment response data
 */
export class PushSubscription extends LinearRequest {
  public constructor(request: Request, data: L.PushSubscriptionFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
}
/**
 * PushSubscriptionConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this PushSubscriptionConnection model
 * @param data - PushSubscriptionConnection response data
 */
export class PushSubscriptionConnection extends LinearConnection<PushSubscription> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<PushSubscription>>,
    data: L.PushSubscriptionConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new PushSubscription(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * PushSubscriptionPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.PushSubscriptionPayloadFragment response data
 */
export class PushSubscriptionPayload extends LinearRequest {
  public constructor(request: Request, data: L.PushSubscriptionPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * A reaction associated with a comment.
 *
 * @param request - function to call the graphql client
 * @param data - L.ReactionFragment response data
 */
export class Reaction extends LinearRequest {
  private _comment?: L.ReactionFragment["comment"];
  private _user?: L.ReactionFragment["user"];

  public constructor(request: Request, data: L.ReactionFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.emoji = data.emoji ?? undefined;
    this.id = data.id ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._comment = data.comment ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Name of the reaction's emoji. */
  public emoji?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The comment that the reaction is associated with. */
  public get comment(): Fetch<Comment> | undefined {
    return this._comment?.id ? new CommentQuery(this._request).fetch(this._comment?.id) : undefined;
  }
  /** The user who reacted. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * ReactionConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this ReactionConnection model
 * @param data - ReactionConnection response data
 */
export class ReactionConnection extends LinearConnection<Reaction> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Reaction>>,
    data: L.ReactionConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Reaction(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * ReactionPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ReactionPayloadFragment response data
 */
export class ReactionPayload extends LinearRequest {
  private _reaction?: L.ReactionPayloadFragment["reaction"];

  public constructor(request: Request, data: L.ReactionPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._reaction = data.reaction ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  public success?: boolean;
  public get reaction(): Fetch<Reaction> | undefined {
    return this._reaction?.id ? new ReactionQuery(this._request).fetch(this._reaction?.id) : undefined;
  }
}
/**
 * RotateSecretPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.RotateSecretPayloadFragment response data
 */
export class RotateSecretPayload extends LinearRequest {
  public constructor(request: Request, data: L.RotateSecretPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * The integration resource's settings
 *
 * @param request - function to call the graphql client
 * @param data - L.SamlConfigurationFragment response data
 */
export class SamlConfiguration extends LinearRequest {
  public constructor(request: Request, data: L.SamlConfigurationFragment) {
    super(request);
    this.allowedDomains = data.allowedDomains ?? undefined;
    this.ssoBinding = data.ssoBinding ?? undefined;
    this.ssoEndpoint = data.ssoEndpoint ?? undefined;
    this.ssoSignAlgo = data.ssoSignAlgo ?? undefined;
    this.ssoSigningCert = data.ssoSigningCert ?? undefined;
  }

  /** List of allowed email domains for SAML authentication. */
  public allowedDomains?: string[];
  /** Binding method for authentication call. Can be either `post` (default) or `redirect`. */
  public ssoBinding?: string;
  /** Sign in endpoint URL for the identity provider. */
  public ssoEndpoint?: string;
  /** The algorithm of the Signing Certificate. Can be one of `sha1`, `sha256` (default), or `sha512`. */
  public ssoSignAlgo?: string;
  /** X.509 Signing Certificate in string form. */
  public ssoSigningCert?: string;
}
/**
 * Sentry issue data
 *
 * @param request - function to call the graphql client
 * @param data - L.SentryIssuePayloadFragment response data
 */
export class SentryIssuePayload extends LinearRequest {
  public constructor(request: Request, data: L.SentryIssuePayloadFragment) {
    super(request);
    this.actorId = data.actorId ?? undefined;
    this.actorName = data.actorName ?? undefined;
    this.actorType = data.actorType ?? undefined;
    this.firstSeen = data.firstSeen ?? undefined;
    this.firstVersion = data.firstVersion ?? undefined;
    this.issueId = data.issueId ?? undefined;
    this.issueTitle = data.issueTitle ?? undefined;
    this.projectId = data.projectId ?? undefined;
    this.projectSlug = data.projectSlug ?? undefined;
    this.shortId = data.shortId ?? undefined;
    this.webUrl = data.webUrl ?? undefined;
  }

  /** The Sentry identifier of the actor who created the issue. */
  public actorId?: number;
  /** The name of the Sentry actor who created this issue. */
  public actorName?: string;
  /** The type of the actor who created the issue. */
  public actorType?: string;
  /** The date this issue was first seen. */
  public firstSeen?: string;
  /** The name of the first release version this issue appeared on, if available. */
  public firstVersion?: string;
  /** The Sentry identifier for the issue. */
  public issueId?: string;
  /** The title of the issue. */
  public issueTitle?: string;
  /** The Sentry identifier of the project this issue belongs to. */
  public projectId?: number;
  /** The slug of the project this issue belongs to. */
  public projectSlug?: string;
  /** The shortId of the issue. */
  public shortId?: string;
  /** The description of the issue. */
  public webUrl?: string;
}
/**
 * Sentry specific settings.
 *
 * @param request - function to call the graphql client
 * @param data - L.SentrySettingsFragment response data
 */
export class SentrySettings extends LinearRequest {
  public constructor(request: Request, data: L.SentrySettingsFragment) {
    super(request);
    this.organizationSlug = data.organizationSlug ?? undefined;
  }

  /** The slug of the Sentry organization being connected. */
  public organizationSlug?: string;
}
/**
 * Slack notification specific settings.
 *
 * @param request - function to call the graphql client
 * @param data - L.SlackPostSettingsFragment response data
 */
export class SlackPostSettings extends LinearRequest {
  public constructor(request: Request, data: L.SlackPostSettingsFragment) {
    super(request);
    this.channel = data.channel ?? undefined;
    this.channelId = data.channelId ?? undefined;
    this.configurationUrl = data.configurationUrl ?? undefined;
  }

  public channel?: string;
  public channelId?: string;
  public configurationUrl?: string;
}
/**
 * SsoUrlFromEmailResponse model
 *
 * @param request - function to call the graphql client
 * @param data - L.SsoUrlFromEmailResponseFragment response data
 */
export class SsoUrlFromEmailResponse extends LinearRequest {
  public constructor(request: Request, data: L.SsoUrlFromEmailResponseFragment) {
    super(request);
    this.samlSsoUrl = data.samlSsoUrl ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** SAML SSO sign-in URL. */
  public samlSsoUrl?: string;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * StepsResponse model
 *
 * @param request - function to call the graphql client
 * @param data - L.StepsResponseFragment response data
 */
export class StepsResponse extends LinearRequest {
  public constructor(request: Request, data: L.StepsResponseFragment) {
    super(request);
    this.clientIds = data.clientIds ?? undefined;
    this.steps = data.steps ?? undefined;
    this.version = data.version ?? undefined;
  }

  /** List of client IDs for the document steps. */
  public clientIds?: string[];
  /** New document steps from the client. */
  public steps?: L.Scalars["JSON"][];
  /** Client's document version. */
  public version?: number;
}
/**
 * The subscription of an organization.
 *
 * @param request - function to call the graphql client
 * @param data - L.SubscriptionFragment response data
 */
export class Subscription extends LinearRequest {
  private _creator?: L.SubscriptionFragment["creator"];

  public constructor(request: Request, data: L.SubscriptionFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.canceledAt = data.canceledAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.pendingChangeType = data.pendingChangeType ?? undefined;
    this.seats = data.seats ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._creator = data.creator ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The date the subscription was canceled, if any. */
  public canceledAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The subscription type of a pending change. Null if no change pending. */
  public pendingChangeType?: string;
  /** The number of seats in the subscription. */
  public seats?: number;
  /** The subscription type. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The creator of the subscription. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The organization that the subscription is associated with. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
}
/**
 * SubscriptionPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.SubscriptionPayloadFragment response data
 */
export class SubscriptionPayload extends LinearRequest {
  public constructor(request: Request, data: L.SubscriptionPayloadFragment) {
    super(request);
    this.canceledAt = data.canceledAt ?? undefined;
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The date the subscription was set to cancel at the end of the billing period, if any. */
  public canceledAt?: L.Scalars["DateTime"];
  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * SubscriptionSessionPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.SubscriptionSessionPayloadFragment response data
 */
export class SubscriptionSessionPayload extends LinearRequest {
  public constructor(request: Request, data: L.SubscriptionSessionPayloadFragment) {
    super(request);
    this.session = data.session ?? undefined;
  }

  /** The subscription session that was created or updated. */
  public session?: string;
}
/**
 * Contains either the full serialized state of the application or delta packets that the requester can
 *   apply to the local data set in order to be up-to-date.
 *
 * @param request - function to call the graphql client
 * @param data - L.SyncResponseFragment response data
 */
export class SyncResponse extends LinearRequest {
  public constructor(request: Request, data: L.SyncResponseFragment) {
    super(request);
    this.archive = data.archive ?? undefined;
    this.databaseVersion = data.databaseVersion ?? undefined;
    this.delta = data.delta ?? undefined;
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.state = data.state ?? undefined;
  }

  /** A JSON serialized collection of model objects loaded from the archive */
  public archive?: string;
  /** The version of the remote database. Incremented by 1 for each migration run on the database. */
  public databaseVersion?: number;
  /**
   * JSON serialized delta changes that the client can apply to its local state
   *     in order to catch up with the state of the world.
   */
  public delta?: string;
  /** The last sync id covered by the response. */
  public lastSyncId?: number;
  /**
   * The full state of the organization as a serialized JSON object.
   *     Mutually exclusive with the delta property
   */
  public state?: string;
}
/**
 * SynchronizedPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.SynchronizedPayloadFragment response data
 */
export class SynchronizedPayload extends LinearRequest {
  public constructor(request: Request, data: L.SynchronizedPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
}
/**
 * An organizational unit that contains issues.
 *
 * @param request - function to call the graphql client
 * @param data - L.TeamFragment response data
 */
export class Team extends LinearRequest {
  private _activeCycle?: L.TeamFragment["activeCycle"];
  private _draftWorkflowState?: L.TeamFragment["draftWorkflowState"];
  private _markedAsDuplicateWorkflowState?: L.TeamFragment["markedAsDuplicateWorkflowState"];
  private _mergeWorkflowState?: L.TeamFragment["mergeWorkflowState"];
  private _reviewWorkflowState?: L.TeamFragment["reviewWorkflowState"];
  private _startWorkflowState?: L.TeamFragment["startWorkflowState"];

  public constructor(request: Request, data: L.TeamFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.autoArchivePeriod = data.autoArchivePeriod ?? undefined;
    this.autoClosePeriod = data.autoClosePeriod ?? undefined;
    this.autoCloseStateId = data.autoCloseStateId ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.cycleCalenderUrl = data.cycleCalenderUrl ?? undefined;
    this.cycleCooldownTime = data.cycleCooldownTime ?? undefined;
    this.cycleDuration = data.cycleDuration ?? undefined;
    this.cycleIssueAutoAssignCompleted = data.cycleIssueAutoAssignCompleted ?? undefined;
    this.cycleIssueAutoAssignStarted = data.cycleIssueAutoAssignStarted ?? undefined;
    this.cycleLockToActive = data.cycleLockToActive ?? undefined;
    this.cycleStartDay = data.cycleStartDay ?? undefined;
    this.cyclesEnabled = data.cyclesEnabled ?? undefined;
    this.defaultIssueEstimate = data.defaultIssueEstimate ?? undefined;
    this.description = data.description ?? undefined;
    this.groupIssueHistory = data.groupIssueHistory ?? undefined;
    this.id = data.id ?? undefined;
    this.inviteHash = data.inviteHash ?? undefined;
    this.issueEstimationAllowZero = data.issueEstimationAllowZero ?? undefined;
    this.issueEstimationExtended = data.issueEstimationExtended ?? undefined;
    this.issueEstimationType = data.issueEstimationType ?? undefined;
    this.key = data.key ?? undefined;
    this.name = data.name ?? undefined;
    this.slackIssueComments = data.slackIssueComments ?? undefined;
    this.slackIssueStatuses = data.slackIssueStatuses ?? undefined;
    this.slackNewIssue = data.slackNewIssue ?? undefined;
    this.timezone = data.timezone ?? undefined;
    this.upcomingCycleCount = data.upcomingCycleCount ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._activeCycle = data.activeCycle ?? undefined;
    this._draftWorkflowState = data.draftWorkflowState ?? undefined;
    this._markedAsDuplicateWorkflowState = data.markedAsDuplicateWorkflowState ?? undefined;
    this._mergeWorkflowState = data.mergeWorkflowState ?? undefined;
    this._reviewWorkflowState = data.reviewWorkflowState ?? undefined;
    this._startWorkflowState = data.startWorkflowState ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** Period after which automatically closed and completed issues are automatically archived in months. Null/undefined means disabled. */
  public autoArchivePeriod?: number;
  /** Period after which issues are automatically closed in months. Null/undefined means disabled. */
  public autoClosePeriod?: number;
  /** The canceled workflow state which auto closed issues will be set to. Defaults to the first canceled state. */
  public autoCloseStateId?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Calender feed (iCal) for cycles. */
  public cycleCalenderUrl?: string;
  /** The cooldown time after each cycle in weeks. */
  public cycleCooldownTime?: number;
  /** The duration of a cycle in weeks. */
  public cycleDuration?: number;
  /** Auto assign completed issues to current cycle. */
  public cycleIssueAutoAssignCompleted?: boolean;
  /** Auto assign started issues to current cycle. */
  public cycleIssueAutoAssignStarted?: boolean;
  /** Only allow issues issues with cycles in Active Issues. */
  public cycleLockToActive?: boolean;
  /** The day of the week that a new cycle starts. */
  public cycleStartDay?: number;
  /** Whether the team uses cycles. */
  public cyclesEnabled?: boolean;
  /** What to use as an default estimate for unestimated issues. */
  public defaultIssueEstimate?: number;
  /** The team's description. */
  public description?: string;
  /** Whether to group recent issue history entries. */
  public groupIssueHistory?: boolean;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Unique hash for the team to be used in invite URLs. */
  public inviteHash?: string;
  /** Whether to allow zeros in issues estimates. */
  public issueEstimationAllowZero?: boolean;
  /** Whether to add additional points to the estimate scale. */
  public issueEstimationExtended?: boolean;
  /** The issue estimation type to use. */
  public issueEstimationType?: string;
  /** The team's unique key. The key is used in URLs. */
  public key?: string;
  /** The team's name. */
  public name?: string;
  /** Whether to send new issue comment notifications to Slack. */
  public slackIssueComments?: boolean;
  /** Whether to send new issue status updates to Slack. */
  public slackIssueStatuses?: boolean;
  /** Whether to send new issue notifications to Slack. */
  public slackNewIssue?: boolean;
  /** The timezone of the team. Defaults to "America/Los_Angeles" */
  public timezone?: string;
  /** How many upcoming cycles to create. */
  public upcomingCycleCount?: number;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Team's currently active cycle. */
  public get activeCycle(): Fetch<Cycle> | undefined {
    return this._activeCycle?.id ? new CycleQuery(this._request).fetch(this._activeCycle?.id) : undefined;
  }
  /** The workflow state into which issues are moved when a PR has been opened as draft. */
  public get draftWorkflowState(): Fetch<WorkflowState> | undefined {
    return this._draftWorkflowState?.id
      ? new WorkflowStateQuery(this._request).fetch(this._draftWorkflowState?.id)
      : undefined;
  }
  /** The workflow state into which issues are moved when they are marked as a duplicate of another issue. Defaults to the first canceled state. */
  public get markedAsDuplicateWorkflowState(): Fetch<WorkflowState> | undefined {
    return this._markedAsDuplicateWorkflowState?.id
      ? new WorkflowStateQuery(this._request).fetch(this._markedAsDuplicateWorkflowState?.id)
      : undefined;
  }
  /** The workflow state into which issues are moved when a PR has been merged. */
  public get mergeWorkflowState(): Fetch<WorkflowState> | undefined {
    return this._mergeWorkflowState?.id
      ? new WorkflowStateQuery(this._request).fetch(this._mergeWorkflowState?.id)
      : undefined;
  }
  /** The organization that the team is associated with. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /** The workflow state into which issues are moved when a review has been requested for the PR. */
  public get reviewWorkflowState(): Fetch<WorkflowState> | undefined {
    return this._reviewWorkflowState?.id
      ? new WorkflowStateQuery(this._request).fetch(this._reviewWorkflowState?.id)
      : undefined;
  }
  /** The workflow state into which issues are moved when a PR has been opened. */
  public get startWorkflowState(): Fetch<WorkflowState> | undefined {
    return this._startWorkflowState?.id
      ? new WorkflowStateQuery(this._request).fetch(this._startWorkflowState?.id)
      : undefined;
  }
  /** Cycles associated with the team. */
  public cycles(variables?: Omit<L.Team_CyclesQueryVariables, "id">) {
    return this.id ? new Team_CyclesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Issues associated with the team. */
  public issues(variables?: Omit<L.Team_IssuesQueryVariables, "id">) {
    return this.id ? new Team_IssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Labels associated with the team. */
  public labels(variables?: Omit<L.Team_LabelsQueryVariables, "id">) {
    return this.id ? new Team_LabelsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Memberships associated with the team. */
  public memberships(variables?: Omit<L.Team_MembershipsQueryVariables, "id">) {
    return this.id ? new Team_MembershipsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Projects associated with the team. */
  public projects(variables?: Omit<L.Team_ProjectsQueryVariables, "id">) {
    return this.id ? new Team_ProjectsQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** The states that define the workflow associated with the team. */
  public states(variables?: Omit<L.Team_StatesQueryVariables, "id">) {
    return this.id ? new Team_StatesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Templates associated with the team. */
  public templates(variables?: Omit<L.Team_TemplatesQueryVariables, "id">) {
    return this.id ? new Team_TemplatesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Webhooks associated with the team. */
  public webhooks(variables?: Omit<L.Team_WebhooksQueryVariables, "id">) {
    return this.id ? new Team_WebhooksQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * TeamConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this TeamConnection model
 * @param data - TeamConnection response data
 */
export class TeamConnection extends LinearConnection<Team> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Team>>,
    data: L.TeamConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Team(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * Defines the membership of a user to a team.
 *
 * @param request - function to call the graphql client
 * @param data - L.TeamMembershipFragment response data
 */
export class TeamMembership extends LinearRequest {
  private _team?: L.TeamMembershipFragment["team"];
  private _user?: L.TeamMembershipFragment["user"];

  public constructor(request: Request, data: L.TeamMembershipFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._team = data.team ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The team that the membership is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** The user that the membership is associated with. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * TeamMembershipConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this TeamMembershipConnection model
 * @param data - TeamMembershipConnection response data
 */
export class TeamMembershipConnection extends LinearConnection<TeamMembership> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<TeamMembership>>,
    data: L.TeamMembershipConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new TeamMembership(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * TeamMembershipPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.TeamMembershipPayloadFragment response data
 */
export class TeamMembershipPayload extends LinearRequest {
  private _teamMembership?: L.TeamMembershipPayloadFragment["teamMembership"];

  public constructor(request: Request, data: L.TeamMembershipPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._teamMembership = data.teamMembership ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The team membership that was created or updated. */
  public get teamMembership(): Fetch<TeamMembership> | undefined {
    return this._teamMembership?.id
      ? new TeamMembershipQuery(this._request).fetch(this._teamMembership?.id)
      : undefined;
  }
}
/**
 * TeamPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.TeamPayloadFragment response data
 */
export class TeamPayload extends LinearRequest {
  private _team?: L.TeamPayloadFragment["team"];

  public constructor(request: Request, data: L.TeamPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The team that was created or updated. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
}
/**
 * A template object used for creating new issues faster.
 *
 * @param request - function to call the graphql client
 * @param data - L.TemplateFragment response data
 */
export class Template extends LinearRequest {
  private _creator?: L.TemplateFragment["creator"];
  private _team?: L.TemplateFragment["team"];

  public constructor(request: Request, data: L.TemplateFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.templateData = data.templateData ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._creator = data.creator ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Template description. */
  public description?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The name of the template. */
  public name?: string;
  /** Template data. */
  public templateData?: L.Scalars["JSON"];
  /** The entity type this template is for. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user who created the template. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The team that the template is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
}
/**
 * TemplateConnection model
 *
 * @param request - function to call the graphql client
 * @param data - L.TemplateConnectionFragment response data
 */
export class TemplateConnection extends LinearRequest {
  public constructor(request: Request, data: L.TemplateConnectionFragment) {
    super(request);
    this.pageInfo = data.pageInfo ? new PageInfo(request, data.pageInfo) : undefined;
  }

  public pageInfo?: PageInfo;
  public get nodes(): Fetch<Template[]> {
    return new TemplatesQuery(this._request).fetch();
  }
}
/**
 * TemplatePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.TemplatePayloadFragment response data
 */
export class TemplatePayload extends LinearRequest {
  private _template?: L.TemplatePayloadFragment["template"];

  public constructor(request: Request, data: L.TemplatePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._template = data.template ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The template that was created or updated. */
  public get template(): Fetch<Template> | undefined {
    return this._template?.id ? new TemplateQuery(this._request).fetch(this._template?.id) : undefined;
  }
}
/**
 * Object representing Google Cloud upload policy, plus additional data.
 *
 * @param request - function to call the graphql client
 * @param data - L.UploadFileFragment response data
 */
export class UploadFile extends LinearRequest {
  public constructor(request: Request, data: L.UploadFileFragment) {
    super(request);
    this.assetUrl = data.assetUrl ?? undefined;
    this.contentType = data.contentType ?? undefined;
    this.filename = data.filename ?? undefined;
    this.metaData = data.metaData ?? undefined;
    this.size = data.size ?? undefined;
    this.uploadUrl = data.uploadUrl ?? undefined;
    this.headers = data.headers ? data.headers.map(node => new UploadFileHeader(request, node)) : undefined;
  }

  /** The asset URL for the uploaded file. (assigned automatically) */
  public assetUrl?: string;
  /** The content type. */
  public contentType?: string;
  /** The filename. */
  public filename?: string;
  public metaData?: L.Scalars["JSON"];
  /** The size of the uploaded file. */
  public size?: number;
  /** The signed URL the for the uploaded file. (assigned automatically) */
  public uploadUrl?: string;
  public headers?: UploadFileHeader[];
}
/**
 * UploadFileHeader model
 *
 * @param request - function to call the graphql client
 * @param data - L.UploadFileHeaderFragment response data
 */
export class UploadFileHeader extends LinearRequest {
  public constructor(request: Request, data: L.UploadFileHeaderFragment) {
    super(request);
    this.key = data.key ?? undefined;
    this.value = data.value ?? undefined;
  }

  /** Upload file header key. */
  public key?: string;
  /** Upload file header value. */
  public value?: string;
}
/**
 * UploadPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UploadPayloadFragment response data
 */
export class UploadPayload extends LinearRequest {
  public constructor(request: Request, data: L.UploadPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.uploadFile = data.uploadFile ? new UploadFile(request, data.uploadFile) : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** Object describing the file to be uploaded. */
  public uploadFile?: UploadFile;
}
/**
 * A user that has access to the the resources of an organization.
 *
 * @param request - function to call the graphql client
 * @param data - L.UserFragment response data
 */
export class User extends LinearRequest {
  public constructor(request: Request, data: L.UserFragment) {
    super(request);
    this.active = data.active ?? undefined;
    this.admin = data.admin ?? undefined;
    this.archivedAt = data.archivedAt ?? undefined;
    this.avatarUrl = data.avatarUrl ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.createdIssueCount = data.createdIssueCount ?? undefined;
    this.displayName = data.displayName ?? undefined;
    this.email = data.email ?? undefined;
    this.id = data.id ?? undefined;
    this.inviteHash = data.inviteHash ?? undefined;
    this.lastSeen = data.lastSeen ?? undefined;
    this.name = data.name ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
  }

  /** Whether the user account is active or disabled. */
  public active?: boolean;
  /** Whether the user is an organization administrator. */
  public admin?: boolean;
  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** An URL to the user's avatar image. */
  public avatarUrl?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Number of issues created. */
  public createdIssueCount?: number;
  /** The user's display (nick) name. Unique within each organization. */
  public displayName?: string;
  /** The user's email address. */
  public email?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Unique hash for the user to be used in invite URLs. */
  public inviteHash?: string;
  /** The last time the user was seen online. If null, the user is currently online. */
  public lastSeen?: L.Scalars["DateTime"];
  /** The user's full name. */
  public name?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Organization in which the user belongs to. */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /** Issues assigned to the user. */
  public assignedIssues(variables?: Omit<L.User_AssignedIssuesQueryVariables, "id">) {
    return this.id ? new User_AssignedIssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Issues created by the user. */
  public createdIssues(variables?: Omit<L.User_CreatedIssuesQueryVariables, "id">) {
    return this.id ? new User_CreatedIssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
  /** Memberships associated with the user. */
  public teamMemberships(variables?: Omit<L.User_TeamMembershipsQueryVariables, "id">) {
    return this.id ? new User_TeamMembershipsQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * A user account.
 *
 * @param request - function to call the graphql client
 * @param data - L.UserAccountFragment response data
 */
export class UserAccount extends LinearRequest {
  public constructor(request: Request, data: L.UserAccountFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.email = data.email ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.service = data.service ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.users = data.users ? data.users.map(node => new User(request, node)) : undefined;
  }

  /** The time at which the model was archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the model was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The user's email address. */
  public email?: string;
  /** The models identifier. */
  public id?: string;
  /** The user's name. */
  public name?: string;
  /** The authentication service used to create the account. */
  public service?: string;
  /** The time at which the model was updated. */
  public updatedAt?: L.Scalars["DateTime"];
  /** Users belonging to the account. */
  public users?: User[];
}
/**
 * UserAdminPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UserAdminPayloadFragment response data
 */
export class UserAdminPayload extends LinearRequest {
  public constructor(request: Request, data: L.UserAdminPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * Public information of the OAuth application, plus whether the application has been authorized for the given scopes.
 *
 * @param request - function to call the graphql client
 * @param data - L.UserAuthorizedApplicationFragment response data
 */
export class UserAuthorizedApplication extends LinearRequest {
  public constructor(request: Request, data: L.UserAuthorizedApplicationFragment) {
    super(request);
    this.clientId = data.clientId ?? undefined;
    this.description = data.description ?? undefined;
    this.developer = data.developer ?? undefined;
    this.developerUrl = data.developerUrl ?? undefined;
    this.imageUrl = data.imageUrl ?? undefined;
    this.isAuthorized = data.isAuthorized ?? undefined;
    this.name = data.name ?? undefined;
  }

  /** OAuth application's client ID. */
  public clientId?: string;
  /** Information about the application. */
  public description?: string;
  /** Name of the developer. */
  public developer?: string;
  /** Url of the developer (homepage or docs). */
  public developerUrl?: string;
  /** Image of the application. */
  public imageUrl?: string;
  /** Whether the user has authorized the application for the given scopes. */
  public isAuthorized?: boolean;
  /** Application name. */
  public name?: string;
}
/**
 * UserConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this UserConnection model
 * @param data - UserConnection response data
 */
export class UserConnection extends LinearConnection<User> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<User>>,
    data: L.UserConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new User(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * UserPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UserPayloadFragment response data
 */
export class UserPayload extends LinearRequest {
  private _user?: L.UserPayloadFragment["user"];

  public constructor(request: Request, data: L.UserPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The user that was created or updated. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * The settings of a user as a JSON object.
 *
 * @param request - function to call the graphql client
 * @param data - L.UserSettingsFragment response data
 */
export class UserSettings extends LinearRequest {
  private _user?: L.UserSettingsFragment["user"];

  public constructor(request: Request, data: L.UserSettingsFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.notificationPreferences = data.notificationPreferences ?? undefined;
    this.unsubscribedFrom = data.unsubscribedFrom ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._user = data.user ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The notification channel settings the user has selected. */
  public notificationPreferences?: L.Scalars["JSONObject"];
  /** The email types the user has unsubscribed from. */
  public unsubscribedFrom?: string[];
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The user to whom this notification was targeted for. */
  public get user(): Fetch<User> | undefined {
    return this._user?.id ? new UserQuery(this._request).fetch(this._user?.id) : undefined;
  }
}
/**
 * UserSettingsFlagPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UserSettingsFlagPayloadFragment response data
 */
export class UserSettingsFlagPayload extends LinearRequest {
  public constructor(request: Request, data: L.UserSettingsFlagPayloadFragment) {
    super(request);
    this.flag = data.flag ?? undefined;
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.value = data.value ?? undefined;
  }

  /** The flag key which was updated. */
  public flag?: string;
  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The flag value after update. */
  public value?: number;
}
/**
 * UserSettingsFlagsResetPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UserSettingsFlagsResetPayloadFragment response data
 */
export class UserSettingsFlagsResetPayload extends LinearRequest {
  public constructor(request: Request, data: L.UserSettingsFlagsResetPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * UserSettingsPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UserSettingsPayloadFragment response data
 */
export class UserSettingsPayload extends LinearRequest {
  public constructor(request: Request, data: L.UserSettingsPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The user's settings. */
  public get userSettings(): Fetch<UserSettings> {
    return new UserSettingsQuery(this._request).fetch();
  }
}
/**
 * UserSubscribeToNewsletterPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.UserSubscribeToNewsletterPayloadFragment response data
 */
export class UserSubscribeToNewsletterPayload extends LinearRequest {
  public constructor(request: Request, data: L.UserSubscribeToNewsletterPayloadFragment) {
    super(request);
    this.success = data.success ?? undefined;
  }

  /** Whether the operation was successful. */
  public success?: boolean;
}
/**
 * View preferences.
 *
 * @param request - function to call the graphql client
 * @param data - L.ViewPreferencesFragment response data
 */
export class ViewPreferences extends LinearRequest {
  public constructor(request: Request, data: L.ViewPreferencesFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.id = data.id ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.viewType = data.viewType ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** The unique identifier of the entity. */
  public id?: string;
  /** The view preference type. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The view type. */
  public viewType?: string;
}
/**
 * ViewPreferencesPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.ViewPreferencesPayloadFragment response data
 */
export class ViewPreferencesPayload extends LinearRequest {
  public constructor(request: Request, data: L.ViewPreferencesPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this.viewPreferences = data.viewPreferences ? new ViewPreferences(request, data.viewPreferences) : undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The view preferences entity being mutated. */
  public viewPreferences?: ViewPreferences;
}
/**
 * A webhook used to send HTTP notifications over data updates
 *
 * @param request - function to call the graphql client
 * @param data - L.WebhookFragment response data
 */
export class Webhook extends LinearRequest {
  private _creator?: L.WebhookFragment["creator"];
  private _team?: L.WebhookFragment["team"];

  public constructor(request: Request, data: L.WebhookFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.enabled = data.enabled ?? undefined;
    this.id = data.id ?? undefined;
    this.secret = data.secret ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this.url = data.url ?? undefined;
    this._creator = data.creator ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Whether the Webhook is enabled. */
  public enabled?: boolean;
  /** The unique identifier of the entity. */
  public id?: string;
  /** Secret token for verifying the origin on the recipient side. */
  public secret?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** Webhook URL */
  public url?: string;
  /** The user who created the webhook. */
  public get creator(): Fetch<User> | undefined {
    return this._creator?.id ? new UserQuery(this._request).fetch(this._creator?.id) : undefined;
  }
  /** The team that the webhook is associated with. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
}
/**
 * WebhookConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this WebhookConnection model
 * @param data - WebhookConnection response data
 */
export class WebhookConnection extends LinearConnection<Webhook> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<Webhook>>,
    data: L.WebhookConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new Webhook(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * WebhookPayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.WebhookPayloadFragment response data
 */
export class WebhookPayload extends LinearRequest {
  private _webhook?: L.WebhookPayloadFragment["webhook"];

  public constructor(request: Request, data: L.WebhookPayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._webhook = data.webhook ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The webhook entity being mutated. */
  public get webhook(): Fetch<Webhook> | undefined {
    return this._webhook?.id ? new WebhookQuery(this._request).fetch(this._webhook?.id) : undefined;
  }
}
/**
 * A state in a team workflow.
 *
 * @param request - function to call the graphql client
 * @param data - L.WorkflowStateFragment response data
 */
export class WorkflowState extends LinearRequest {
  private _team?: L.WorkflowStateFragment["team"];

  public constructor(request: Request, data: L.WorkflowStateFragment) {
    super(request);
    this.archivedAt = data.archivedAt ?? undefined;
    this.color = data.color ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.description = data.description ?? undefined;
    this.id = data.id ?? undefined;
    this.name = data.name ?? undefined;
    this.position = data.position ?? undefined;
    this.type = data.type ?? undefined;
    this.updatedAt = data.updatedAt ?? undefined;
    this._team = data.team ?? undefined;
  }

  /** The time at which the entity was archived. Null if the entity has not been archived. */
  public archivedAt?: L.Scalars["DateTime"];
  /** The state's UI color as a HEX string. */
  public color?: string;
  /** The time at which the entity was created. */
  public createdAt?: L.Scalars["DateTime"];
  /** Description of the state. */
  public description?: string;
  /** The unique identifier of the entity. */
  public id?: string;
  /** The state's name. */
  public name?: string;
  /** The position of the state in the team flow. */
  public position?: number;
  /** The type of the state. */
  public type?: string;
  /**
   * The last time at which the entity was updated. This is the same as the creation time if the
   *     entity hasn't been update after creation.
   */
  public updatedAt?: L.Scalars["DateTime"];
  /** The team to which this state belongs to. */
  public get team(): Fetch<Team> | undefined {
    return this._team?.id ? new TeamQuery(this._request).fetch(this._team?.id) : undefined;
  }
  /** Issues belonging in this state. */
  public issues(variables?: Omit<L.WorkflowState_IssuesQueryVariables, "id">) {
    return this.id ? new WorkflowState_IssuesQuery(this._request, this.id).fetch(variables) : undefined;
  }
}
/**
 * WorkflowStateConnection model
 *
 * @param request - function to call the graphql client
 * @param fetch - function to trigger a refetch of this WorkflowStateConnection model
 * @param data - WorkflowStateConnection response data
 */
export class WorkflowStateConnection extends LinearConnection<WorkflowState> {
  public constructor(
    request: Request,
    fetch: (variables?: ConnectionVariables) => Fetch<Connection<WorkflowState>>,
    data: L.WorkflowStateConnectionFragment
  ) {
    super(
      request,
      fetch,
      data?.nodes ? data.nodes.map(node => new WorkflowState(request, node)) : undefined,
      data?.pageInfo ? new PageInfo(request, data.pageInfo) : undefined
    );
  }
}
/**
 * WorkflowStatePayload model
 *
 * @param request - function to call the graphql client
 * @param data - L.WorkflowStatePayloadFragment response data
 */
export class WorkflowStatePayload extends LinearRequest {
  private _workflowState?: L.WorkflowStatePayloadFragment["workflowState"];

  public constructor(request: Request, data: L.WorkflowStatePayloadFragment) {
    super(request);
    this.lastSyncId = data.lastSyncId ?? undefined;
    this.success = data.success ?? undefined;
    this._workflowState = data.workflowState ?? undefined;
  }

  /** The identifier of the last sync operation. */
  public lastSyncId?: number;
  /** Whether the operation was successful. */
  public success?: boolean;
  /** The state that was created or updated. */
  public get workflowState(): Fetch<WorkflowState> | undefined {
    return this._workflowState?.id ? new WorkflowStateQuery(this._request).fetch(this._workflowState?.id) : undefined;
  }
}
/**
 * A fetchable ApiKeys Query
 *
 * @param request - function to call the graphql client
 */
export class ApiKeysQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ApiKeys query and return a ApiKeyConnection
   *
   * @param variables - variables to pass into the ApiKeysQuery
   * @returns parsed response from ApiKeysQuery
   */
  public async fetch(variables?: L.ApiKeysQueryVariables): Fetch<ApiKeyConnection> {
    return this._request<L.ApiKeysQuery, L.ApiKeysQueryVariables>(L.ApiKeysDocument, variables).then(response => {
      const data = response?.apiKeys;
      return data
        ? new ApiKeyConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable ApplicationWithAuthorization Query
 *
 * @param request - function to call the graphql client
 */
export class ApplicationWithAuthorizationQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ApplicationWithAuthorization query and return a UserAuthorizedApplication
   *
   * @param clientId - required clientId to pass to applicationWithAuthorization
   * @param scope - required scope to pass to applicationWithAuthorization
   * @param variables - variables without 'clientId', 'scope' to pass into the ApplicationWithAuthorizationQuery
   * @returns parsed response from ApplicationWithAuthorizationQuery
   */
  public async fetch(
    clientId: string,
    scope: string[],
    variables?: Omit<L.ApplicationWithAuthorizationQueryVariables, "clientId" | "scope">
  ): Fetch<UserAuthorizedApplication> {
    return this._request<L.ApplicationWithAuthorizationQuery, L.ApplicationWithAuthorizationQueryVariables>(
      L.ApplicationWithAuthorizationDocument,
      {
        clientId,
        scope,
        ...variables,
      }
    ).then(response => {
      const data = response?.applicationWithAuthorization;
      return data ? new UserAuthorizedApplication(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ArchivedModelSync Query
 *
 * @param request - function to call the graphql client
 */
export class ArchivedModelSyncQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ArchivedModelSync query and return a ArchiveResponse
   *
   * @param identifier - required identifier to pass to archivedModelSync
   * @param modelClass - required modelClass to pass to archivedModelSync
   * @returns parsed response from ArchivedModelSyncQuery
   */
  public async fetch(identifier: string, modelClass: string): Fetch<ArchiveResponse> {
    return this._request<L.ArchivedModelSyncQuery, L.ArchivedModelSyncQueryVariables>(L.ArchivedModelSyncDocument, {
      identifier,
      modelClass,
    }).then(response => {
      const data = response?.archivedModelSync;
      return data ? new ArchiveResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ArchivedModelsSync Query
 *
 * @param request - function to call the graphql client
 */
export class ArchivedModelsSyncQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ArchivedModelsSync query and return a ArchiveResponse
   *
   * @param modelClass - required modelClass to pass to archivedModelsSync
   * @param teamId - required teamId to pass to archivedModelsSync
   * @param variables - variables without 'modelClass', 'teamId' to pass into the ArchivedModelsSyncQuery
   * @returns parsed response from ArchivedModelsSyncQuery
   */
  public async fetch(
    modelClass: string,
    teamId: string,
    variables?: Omit<L.ArchivedModelsSyncQueryVariables, "modelClass" | "teamId">
  ): Fetch<ArchiveResponse> {
    return this._request<L.ArchivedModelsSyncQuery, L.ArchivedModelsSyncQueryVariables>(L.ArchivedModelsSyncDocument, {
      modelClass,
      teamId,
      ...variables,
    }).then(response => {
      const data = response?.archivedModelsSync;
      return data ? new ArchiveResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable AuthorizedApplications Query
 *
 * @param request - function to call the graphql client
 */
export class AuthorizedApplicationsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the AuthorizedApplications query and return a AuthorizedApplication list
   *
   * @returns parsed response from AuthorizedApplicationsQuery
   */
  public async fetch(): Fetch<AuthorizedApplication[]> {
    return this._request<L.AuthorizedApplicationsQuery, L.AuthorizedApplicationsQueryVariables>(
      L.AuthorizedApplicationsDocument,
      {}
    ).then(response => {
      const data = response?.authorizedApplications;
      return data ? data.map(node => new AuthorizedApplication(this._request, node)) : undefined;
    });
  }
}

/**
 * A fetchable AvailableUsers Query
 *
 * @param request - function to call the graphql client
 */
export class AvailableUsersQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the AvailableUsers query and return a AuthResolverResponse
   *
   * @returns parsed response from AvailableUsersQuery
   */
  public async fetch(): Fetch<AuthResolverResponse> {
    return this._request<L.AvailableUsersQuery, L.AvailableUsersQueryVariables>(L.AvailableUsersDocument, {}).then(
      response => {
        const data = response?.availableUsers;
        return data ? new AuthResolverResponse(this._request, data) : undefined;
      }
    );
  }
}

/**
 * A fetchable BillingDetails Query
 *
 * @param request - function to call the graphql client
 */
export class BillingDetailsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the BillingDetails query and return a BillingDetailsPayload
   *
   * @returns parsed response from BillingDetailsQuery
   */
  public async fetch(): Fetch<BillingDetailsPayload> {
    return this._request<L.BillingDetailsQuery, L.BillingDetailsQueryVariables>(L.BillingDetailsDocument, {}).then(
      response => {
        const data = response?.billingDetails;
        return data ? new BillingDetailsPayload(this._request, data) : undefined;
      }
    );
  }
}

/**
 * A fetchable CollaborativeDocumentJoin Query
 *
 * @param request - function to call the graphql client
 */
export class CollaborativeDocumentJoinQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CollaborativeDocumentJoin query and return a CollaborationDocumentUpdatePayload
   *
   * @param clientId - required clientId to pass to collaborativeDocumentJoin
   * @param issueId - required issueId to pass to collaborativeDocumentJoin
   * @param version - required version to pass to collaborativeDocumentJoin
   * @returns parsed response from CollaborativeDocumentJoinQuery
   */
  public async fetch(clientId: string, issueId: string, version: number): Fetch<CollaborationDocumentUpdatePayload> {
    return this._request<L.CollaborativeDocumentJoinQuery, L.CollaborativeDocumentJoinQueryVariables>(
      L.CollaborativeDocumentJoinDocument,
      {
        clientId,
        issueId,
        version,
      }
    ).then(response => {
      const data = response?.collaborativeDocumentJoin;
      return data ? new CollaborationDocumentUpdatePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Comment Query
 *
 * @param request - function to call the graphql client
 */
export class CommentQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Comment query and return a Comment
   *
   * @param id - required id to pass to comment
   * @returns parsed response from CommentQuery
   */
  public async fetch(id: string): Fetch<Comment> {
    return this._request<L.CommentQuery, L.CommentQueryVariables>(L.CommentDocument, {
      id,
    }).then(response => {
      const data = response?.comment;
      return data ? new Comment(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Comments Query
 *
 * @param request - function to call the graphql client
 */
export class CommentsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Comments query and return a CommentConnection
   *
   * @param variables - variables to pass into the CommentsQuery
   * @returns parsed response from CommentsQuery
   */
  public async fetch(variables?: L.CommentsQueryVariables): Fetch<CommentConnection> {
    return this._request<L.CommentsQuery, L.CommentsQueryVariables>(L.CommentsDocument, variables).then(response => {
      const data = response?.comments;
      return data
        ? new CommentConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable CustomView Query
 *
 * @param request - function to call the graphql client
 */
export class CustomViewQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CustomView query and return a CustomView
   *
   * @param id - required id to pass to customView
   * @returns parsed response from CustomViewQuery
   */
  public async fetch(id: string): Fetch<CustomView> {
    return this._request<L.CustomViewQuery, L.CustomViewQueryVariables>(L.CustomViewDocument, {
      id,
    }).then(response => {
      const data = response?.customView;
      return data ? new CustomView(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CustomViews Query
 *
 * @param request - function to call the graphql client
 */
export class CustomViewsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CustomViews query and return a CustomViewConnection
   *
   * @param variables - variables to pass into the CustomViewsQuery
   * @returns parsed response from CustomViewsQuery
   */
  public async fetch(variables?: L.CustomViewsQueryVariables): Fetch<CustomViewConnection> {
    return this._request<L.CustomViewsQuery, L.CustomViewsQueryVariables>(L.CustomViewsDocument, variables).then(
      response => {
        const data = response?.customViews;
        return data
          ? new CustomViewConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
          : undefined;
      }
    );
  }
}

/**
 * A fetchable Cycle Query
 *
 * @param request - function to call the graphql client
 */
export class CycleQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Cycle query and return a Cycle
   *
   * @param id - required id to pass to cycle
   * @returns parsed response from CycleQuery
   */
  public async fetch(id: string): Fetch<Cycle> {
    return this._request<L.CycleQuery, L.CycleQueryVariables>(L.CycleDocument, {
      id,
    }).then(response => {
      const data = response?.cycle;
      return data ? new Cycle(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Cycles Query
 *
 * @param request - function to call the graphql client
 */
export class CyclesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Cycles query and return a CycleConnection
   *
   * @param variables - variables to pass into the CyclesQuery
   * @returns parsed response from CyclesQuery
   */
  public async fetch(variables?: L.CyclesQueryVariables): Fetch<CycleConnection> {
    return this._request<L.CyclesQuery, L.CyclesQueryVariables>(L.CyclesDocument, variables).then(response => {
      const data = response?.cycles;
      return data
        ? new CycleConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Emoji Query
 *
 * @param request - function to call the graphql client
 */
export class EmojiQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Emoji query and return a Emoji
   *
   * @param id - required id to pass to emoji
   * @returns parsed response from EmojiQuery
   */
  public async fetch(id: string): Fetch<Emoji> {
    return this._request<L.EmojiQuery, L.EmojiQueryVariables>(L.EmojiDocument, {
      id,
    }).then(response => {
      const data = response?.emoji;
      return data ? new Emoji(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Emojis Query
 *
 * @param request - function to call the graphql client
 */
export class EmojisQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Emojis query and return a EmojiConnection
   *
   * @param variables - variables to pass into the EmojisQuery
   * @returns parsed response from EmojisQuery
   */
  public async fetch(variables?: L.EmojisQueryVariables): Fetch<EmojiConnection> {
    return this._request<L.EmojisQuery, L.EmojisQueryVariables>(L.EmojisDocument, variables).then(response => {
      const data = response?.emojis;
      return data
        ? new EmojiConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Favorite Query
 *
 * @param request - function to call the graphql client
 */
export class FavoriteQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Favorite query and return a Favorite
   *
   * @param id - required id to pass to favorite
   * @returns parsed response from FavoriteQuery
   */
  public async fetch(id: string): Fetch<Favorite> {
    return this._request<L.FavoriteQuery, L.FavoriteQueryVariables>(L.FavoriteDocument, {
      id,
    }).then(response => {
      const data = response?.favorite;
      return data ? new Favorite(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Favorites Query
 *
 * @param request - function to call the graphql client
 */
export class FavoritesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Favorites query and return a FavoriteConnection
   *
   * @param variables - variables to pass into the FavoritesQuery
   * @returns parsed response from FavoritesQuery
   */
  public async fetch(variables?: L.FavoritesQueryVariables): Fetch<FavoriteConnection> {
    return this._request<L.FavoritesQuery, L.FavoritesQueryVariables>(L.FavoritesDocument, variables).then(response => {
      const data = response?.favorites;
      return data
        ? new FavoriteConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable FigmaEmbedInfo Query
 *
 * @param request - function to call the graphql client
 */
export class FigmaEmbedInfoQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the FigmaEmbedInfo query and return a FigmaEmbedPayload
   *
   * @param fileId - required fileId to pass to figmaEmbedInfo
   * @param variables - variables without 'fileId' to pass into the FigmaEmbedInfoQuery
   * @returns parsed response from FigmaEmbedInfoQuery
   */
  public async fetch(
    fileId: string,
    variables?: Omit<L.FigmaEmbedInfoQueryVariables, "fileId">
  ): Fetch<FigmaEmbedPayload> {
    return this._request<L.FigmaEmbedInfoQuery, L.FigmaEmbedInfoQueryVariables>(L.FigmaEmbedInfoDocument, {
      fileId,
      ...variables,
    }).then(response => {
      const data = response?.figmaEmbedInfo;
      return data ? new FigmaEmbedPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Integration Query
 *
 * @param request - function to call the graphql client
 */
export class IntegrationQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Integration query and return a Integration
   *
   * @param id - required id to pass to integration
   * @returns parsed response from IntegrationQuery
   */
  public async fetch(id: string): Fetch<Integration> {
    return this._request<L.IntegrationQuery, L.IntegrationQueryVariables>(L.IntegrationDocument, {
      id,
    }).then(response => {
      const data = response?.integration;
      return data ? new Integration(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource Query
 *
 * @param request - function to call the graphql client
 */
export class IntegrationResourceQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationResource query and return a IntegrationResource
   *
   * @param id - required id to pass to integrationResource
   * @returns parsed response from IntegrationResourceQuery
   */
  public async fetch(id: string): Fetch<IntegrationResource> {
    return this._request<L.IntegrationResourceQuery, L.IntegrationResourceQueryVariables>(
      L.IntegrationResourceDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.integrationResource;
      return data ? new IntegrationResource(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResources Query
 *
 * @param request - function to call the graphql client
 */
export class IntegrationResourcesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationResources query and return a IntegrationResourceConnection
   *
   * @param variables - variables to pass into the IntegrationResourcesQuery
   * @returns parsed response from IntegrationResourcesQuery
   */
  public async fetch(variables?: L.IntegrationResourcesQueryVariables): Fetch<IntegrationResourceConnection> {
    return this._request<L.IntegrationResourcesQuery, L.IntegrationResourcesQueryVariables>(
      L.IntegrationResourcesDocument,
      variables
    ).then(response => {
      const data = response?.integrationResources;
      return data
        ? new IntegrationResourceConnection(
            this._request,
            pagination => this.fetch({ ...variables, ...pagination }),
            data
          )
        : undefined;
    });
  }
}

/**
 * A fetchable Integrations Query
 *
 * @param request - function to call the graphql client
 */
export class IntegrationsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Integrations query and return a IntegrationConnection
   *
   * @param variables - variables to pass into the IntegrationsQuery
   * @returns parsed response from IntegrationsQuery
   */
  public async fetch(variables?: L.IntegrationsQueryVariables): Fetch<IntegrationConnection> {
    return this._request<L.IntegrationsQuery, L.IntegrationsQueryVariables>(L.IntegrationsDocument, variables).then(
      response => {
        const data = response?.integrations;
        return data
          ? new IntegrationConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
          : undefined;
      }
    );
  }
}

/**
 * A fetchable InviteInfo Query
 *
 * @param request - function to call the graphql client
 */
export class InviteInfoQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the InviteInfo query and return a InvitePagePayload
   *
   * @param userHash - required userHash to pass to inviteInfo
   * @param variables - variables without 'userHash' to pass into the InviteInfoQuery
   * @returns parsed response from InviteInfoQuery
   */
  public async fetch(
    userHash: string,
    variables?: Omit<L.InviteInfoQueryVariables, "userHash">
  ): Fetch<InvitePagePayload> {
    return this._request<L.InviteInfoQuery, L.InviteInfoQueryVariables>(L.InviteInfoDocument, {
      userHash,
      ...variables,
    }).then(response => {
      const data = response?.inviteInfo;
      return data ? new InvitePagePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Issue Query
 *
 * @param request - function to call the graphql client
 */
export class IssueQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Issue query and return a Issue
   *
   * @param id - required id to pass to issue
   * @returns parsed response from IssueQuery
   */
  public async fetch(id: string): Fetch<Issue> {
    return this._request<L.IssueQuery, L.IssueQueryVariables>(L.IssueDocument, {
      id,
    }).then(response => {
      const data = response?.issue;
      return data ? new Issue(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueLabel Query
 *
 * @param request - function to call the graphql client
 */
export class IssueLabelQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueLabel query and return a IssueLabel
   *
   * @param id - required id to pass to issueLabel
   * @returns parsed response from IssueLabelQuery
   */
  public async fetch(id: string): Fetch<IssueLabel> {
    return this._request<L.IssueLabelQuery, L.IssueLabelQueryVariables>(L.IssueLabelDocument, {
      id,
    }).then(response => {
      const data = response?.issueLabel;
      return data ? new IssueLabel(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueLabels Query
 *
 * @param request - function to call the graphql client
 */
export class IssueLabelsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueLabels query and return a IssueLabelConnection
   *
   * @param variables - variables to pass into the IssueLabelsQuery
   * @returns parsed response from IssueLabelsQuery
   */
  public async fetch(variables?: L.IssueLabelsQueryVariables): Fetch<IssueLabelConnection> {
    return this._request<L.IssueLabelsQuery, L.IssueLabelsQueryVariables>(L.IssueLabelsDocument, variables).then(
      response => {
        const data = response?.issueLabels;
        return data
          ? new IssueLabelConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
          : undefined;
      }
    );
  }
}

/**
 * A fetchable IssueRelation Query
 *
 * @param request - function to call the graphql client
 */
export class IssueRelationQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueRelation query and return a IssueRelation
   *
   * @param id - required id to pass to issueRelation
   * @returns parsed response from IssueRelationQuery
   */
  public async fetch(id: string): Fetch<IssueRelation> {
    return this._request<L.IssueRelationQuery, L.IssueRelationQueryVariables>(L.IssueRelationDocument, {
      id,
    }).then(response => {
      const data = response?.issueRelation;
      return data ? new IssueRelation(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueRelations Query
 *
 * @param request - function to call the graphql client
 */
export class IssueRelationsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueRelations query and return a IssueRelationConnection
   *
   * @param variables - variables to pass into the IssueRelationsQuery
   * @returns parsed response from IssueRelationsQuery
   */
  public async fetch(variables?: L.IssueRelationsQueryVariables): Fetch<IssueRelationConnection> {
    return this._request<L.IssueRelationsQuery, L.IssueRelationsQueryVariables>(
      L.IssueRelationsDocument,
      variables
    ).then(response => {
      const data = response?.issueRelations;
      return data
        ? new IssueRelationConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable IssueSearch Query
 *
 * @param request - function to call the graphql client
 */
export class IssueSearchQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueSearch query and return a IssueConnection
   *
   * @param query - required query to pass to issueSearch
   * @param variables - variables without 'query' to pass into the IssueSearchQuery
   * @returns parsed response from IssueSearchQuery
   */
  public async fetch(query: string, variables?: Omit<L.IssueSearchQueryVariables, "query">): Fetch<IssueConnection> {
    return this._request<L.IssueSearchQuery, L.IssueSearchQueryVariables>(L.IssueSearchDocument, {
      query,
      ...variables,
    }).then(response => {
      const data = response?.issueSearch;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch(query, { ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issues Query
 *
 * @param request - function to call the graphql client
 */
export class IssuesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Issues query and return a IssueConnection
   *
   * @param variables - variables to pass into the IssuesQuery
   * @returns parsed response from IssuesQuery
   */
  public async fetch(variables?: L.IssuesQueryVariables): Fetch<IssueConnection> {
    return this._request<L.IssuesQuery, L.IssuesQueryVariables>(L.IssuesDocument, variables).then(response => {
      const data = response?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Milestone Query
 *
 * @param request - function to call the graphql client
 */
export class MilestoneQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Milestone query and return a Milestone
   *
   * @param id - required id to pass to milestone
   * @returns parsed response from MilestoneQuery
   */
  public async fetch(id: string): Fetch<Milestone> {
    return this._request<L.MilestoneQuery, L.MilestoneQueryVariables>(L.MilestoneDocument, {
      id,
    }).then(response => {
      const data = response?.milestone;
      return data ? new Milestone(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Milestones Query
 *
 * @param request - function to call the graphql client
 */
export class MilestonesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Milestones query and return a MilestoneConnection
   *
   * @param variables - variables to pass into the MilestonesQuery
   * @returns parsed response from MilestonesQuery
   */
  public async fetch(variables?: L.MilestonesQueryVariables): Fetch<MilestoneConnection> {
    return this._request<L.MilestonesQuery, L.MilestonesQueryVariables>(L.MilestonesDocument, variables).then(
      response => {
        const data = response?.milestones;
        return data
          ? new MilestoneConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
          : undefined;
      }
    );
  }
}

/**
 * A fetchable Notification Query
 *
 * @param request - function to call the graphql client
 */
export class NotificationQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Notification query and return a Notification
   *
   * @param id - required id to pass to notification
   * @returns parsed response from NotificationQuery
   */
  public async fetch(id: string): Fetch<Notification> {
    return this._request<L.NotificationQuery, L.NotificationQueryVariables>(L.NotificationDocument, {
      id,
    }).then(response => {
      const data = response?.notification;
      return data ? new Notification(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationSubscription Query
 *
 * @param request - function to call the graphql client
 */
export class NotificationSubscriptionQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationSubscription query and return a NotificationSubscription
   *
   * @param id - required id to pass to notificationSubscription
   * @returns parsed response from NotificationSubscriptionQuery
   */
  public async fetch(id: string): Fetch<NotificationSubscription> {
    return this._request<L.NotificationSubscriptionQuery, L.NotificationSubscriptionQueryVariables>(
      L.NotificationSubscriptionDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.notificationSubscription;
      return data ? new NotificationSubscription(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationSubscriptions Query
 *
 * @param request - function to call the graphql client
 */
export class NotificationSubscriptionsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationSubscriptions query and return a NotificationSubscriptionConnection
   *
   * @param variables - variables to pass into the NotificationSubscriptionsQuery
   * @returns parsed response from NotificationSubscriptionsQuery
   */
  public async fetch(variables?: L.NotificationSubscriptionsQueryVariables): Fetch<NotificationSubscriptionConnection> {
    return this._request<L.NotificationSubscriptionsQuery, L.NotificationSubscriptionsQueryVariables>(
      L.NotificationSubscriptionsDocument,
      variables
    ).then(response => {
      const data = response?.notificationSubscriptions;
      return data
        ? new NotificationSubscriptionConnection(
            this._request,
            pagination => this.fetch({ ...variables, ...pagination }),
            data
          )
        : undefined;
    });
  }
}

/**
 * A fetchable Notifications Query
 *
 * @param request - function to call the graphql client
 */
export class NotificationsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Notifications query and return a NotificationConnection
   *
   * @param variables - variables to pass into the NotificationsQuery
   * @returns parsed response from NotificationsQuery
   */
  public async fetch(variables?: L.NotificationsQueryVariables): Fetch<NotificationConnection> {
    return this._request<L.NotificationsQuery, L.NotificationsQueryVariables>(L.NotificationsDocument, variables).then(
      response => {
        const data = response?.notifications;
        return data
          ? new NotificationConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
          : undefined;
      }
    );
  }
}

/**
 * A fetchable Organization Query
 *
 * @param request - function to call the graphql client
 */
export class OrganizationQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Organization query and return a Organization
   *
   * @returns parsed response from OrganizationQuery
   */
  public async fetch(): Fetch<Organization> {
    return this._request<L.OrganizationQuery, L.OrganizationQueryVariables>(L.OrganizationDocument, {}).then(
      response => {
        const data = response?.organization;
        return data ? new Organization(this._request, data) : undefined;
      }
    );
  }
}

/**
 * A fetchable OrganizationExists Query
 *
 * @param request - function to call the graphql client
 */
export class OrganizationExistsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationExists query and return a OrganizationExistsPayload
   *
   * @param urlKey - required urlKey to pass to organizationExists
   * @returns parsed response from OrganizationExistsQuery
   */
  public async fetch(urlKey: string): Fetch<OrganizationExistsPayload> {
    return this._request<L.OrganizationExistsQuery, L.OrganizationExistsQueryVariables>(L.OrganizationExistsDocument, {
      urlKey,
    }).then(response => {
      const data = response?.organizationExists;
      return data ? new OrganizationExistsPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationInvite Query
 *
 * @param request - function to call the graphql client
 */
export class OrganizationInviteQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationInvite query and return a IssueLabel
   *
   * @param id - required id to pass to organizationInvite
   * @returns parsed response from OrganizationInviteQuery
   */
  public async fetch(id: string): Fetch<IssueLabel> {
    return this._request<L.OrganizationInviteQuery, L.OrganizationInviteQueryVariables>(L.OrganizationInviteDocument, {
      id,
    }).then(response => {
      const data = response?.organizationInvite;
      return data ? new IssueLabel(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationInvites Query
 *
 * @param request - function to call the graphql client
 */
export class OrganizationInvitesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationInvites query and return a OrganizationInviteConnection
   *
   * @param variables - variables to pass into the OrganizationInvitesQuery
   * @returns parsed response from OrganizationInvitesQuery
   */
  public async fetch(variables?: L.OrganizationInvitesQueryVariables): Fetch<OrganizationInviteConnection> {
    return this._request<L.OrganizationInvitesQuery, L.OrganizationInvitesQueryVariables>(
      L.OrganizationInvitesDocument,
      variables
    ).then(response => {
      const data = response?.organizationInvites;
      return data
        ? new OrganizationInviteConnection(
            this._request,
            pagination => this.fetch({ ...variables, ...pagination }),
            data
          )
        : undefined;
    });
  }
}

/**
 * A fetchable Project Query
 *
 * @param request - function to call the graphql client
 */
export class ProjectQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Project query and return a Project
   *
   * @param id - required id to pass to project
   * @returns parsed response from ProjectQuery
   */
  public async fetch(id: string): Fetch<Project> {
    return this._request<L.ProjectQuery, L.ProjectQueryVariables>(L.ProjectDocument, {
      id,
    }).then(response => {
      const data = response?.project;
      return data ? new Project(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectLink Query
 *
 * @param request - function to call the graphql client
 */
export class ProjectLinkQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectLink query and return a ProjectLink
   *
   * @param id - required id to pass to projectLink
   * @returns parsed response from ProjectLinkQuery
   */
  public async fetch(id: string): Fetch<ProjectLink> {
    return this._request<L.ProjectLinkQuery, L.ProjectLinkQueryVariables>(L.ProjectLinkDocument, {
      id,
    }).then(response => {
      const data = response?.projectLink;
      return data ? new ProjectLink(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectLinks Query
 *
 * @param request - function to call the graphql client
 */
export class ProjectLinksQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectLinks query and return a ProjectLinkConnection
   *
   * @param variables - variables to pass into the ProjectLinksQuery
   * @returns parsed response from ProjectLinksQuery
   */
  public async fetch(variables?: L.ProjectLinksQueryVariables): Fetch<ProjectLinkConnection> {
    return this._request<L.ProjectLinksQuery, L.ProjectLinksQueryVariables>(L.ProjectLinksDocument, variables).then(
      response => {
        const data = response?.projectLinks;
        return data
          ? new ProjectLinkConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
          : undefined;
      }
    );
  }
}

/**
 * A fetchable Projects Query
 *
 * @param request - function to call the graphql client
 */
export class ProjectsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Projects query and return a ProjectConnection
   *
   * @param variables - variables to pass into the ProjectsQuery
   * @returns parsed response from ProjectsQuery
   */
  public async fetch(variables?: L.ProjectsQueryVariables): Fetch<ProjectConnection> {
    return this._request<L.ProjectsQuery, L.ProjectsQueryVariables>(L.ProjectsDocument, variables).then(response => {
      const data = response?.projects;
      return data
        ? new ProjectConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable PushSubscriptionTest Query
 *
 * @param request - function to call the graphql client
 */
export class PushSubscriptionTestQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the PushSubscriptionTest query and return a PushSubscriptionPayload
   *
   * @returns parsed response from PushSubscriptionTestQuery
   */
  public async fetch(): Fetch<PushSubscriptionPayload> {
    return this._request<L.PushSubscriptionTestQuery, L.PushSubscriptionTestQueryVariables>(
      L.PushSubscriptionTestDocument,
      {}
    ).then(response => {
      const data = response?.pushSubscriptionTest;
      return data ? new PushSubscriptionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Reaction Query
 *
 * @param request - function to call the graphql client
 */
export class ReactionQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Reaction query and return a Reaction
   *
   * @param id - required id to pass to reaction
   * @returns parsed response from ReactionQuery
   */
  public async fetch(id: string): Fetch<Reaction> {
    return this._request<L.ReactionQuery, L.ReactionQueryVariables>(L.ReactionDocument, {
      id,
    }).then(response => {
      const data = response?.reaction;
      return data ? new Reaction(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Reactions Query
 *
 * @param request - function to call the graphql client
 */
export class ReactionsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Reactions query and return a ReactionConnection
   *
   * @param variables - variables to pass into the ReactionsQuery
   * @returns parsed response from ReactionsQuery
   */
  public async fetch(variables?: L.ReactionsQueryVariables): Fetch<ReactionConnection> {
    return this._request<L.ReactionsQuery, L.ReactionsQueryVariables>(L.ReactionsDocument, variables).then(response => {
      const data = response?.reactions;
      return data
        ? new ReactionConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable SsoUrlFromEmail Query
 *
 * @param request - function to call the graphql client
 */
export class SsoUrlFromEmailQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SsoUrlFromEmail query and return a SsoUrlFromEmailResponse
   *
   * @param email - required email to pass to ssoUrlFromEmail
   * @param variables - variables without 'email' to pass into the SsoUrlFromEmailQuery
   * @returns parsed response from SsoUrlFromEmailQuery
   */
  public async fetch(
    email: string,
    variables?: Omit<L.SsoUrlFromEmailQueryVariables, "email">
  ): Fetch<SsoUrlFromEmailResponse> {
    return this._request<L.SsoUrlFromEmailQuery, L.SsoUrlFromEmailQueryVariables>(L.SsoUrlFromEmailDocument, {
      email,
      ...variables,
    }).then(response => {
      const data = response?.ssoUrlFromEmail;
      return data ? new SsoUrlFromEmailResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SyncBootstrap Query
 *
 * @param request - function to call the graphql client
 */
export class SyncBootstrapQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SyncBootstrap query and return a SyncResponse
   *
   * @param databaseVersion - required databaseVersion to pass to syncBootstrap
   * @param sinceSyncId - required sinceSyncId to pass to syncBootstrap
   * @returns parsed response from SyncBootstrapQuery
   */
  public async fetch(databaseVersion: number, sinceSyncId: number): Fetch<SyncResponse> {
    return this._request<L.SyncBootstrapQuery, L.SyncBootstrapQueryVariables>(L.SyncBootstrapDocument, {
      databaseVersion,
      sinceSyncId,
    }).then(response => {
      const data = response?.syncBootstrap;
      return data ? new SyncResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SyncUpdates Query
 *
 * @param request - function to call the graphql client
 */
export class SyncUpdatesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SyncUpdates query and return a SyncResponse
   *
   * @param sinceSyncId - required sinceSyncId to pass to syncUpdates
   * @returns parsed response from SyncUpdatesQuery
   */
  public async fetch(sinceSyncId: number): Fetch<SyncResponse> {
    return this._request<L.SyncUpdatesQuery, L.SyncUpdatesQueryVariables>(L.SyncUpdatesDocument, {
      sinceSyncId,
    }).then(response => {
      const data = response?.syncUpdates;
      return data ? new SyncResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Team Query
 *
 * @param request - function to call the graphql client
 */
export class TeamQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Team query and return a Team
   *
   * @param id - required id to pass to team
   * @returns parsed response from TeamQuery
   */
  public async fetch(id: string): Fetch<Team> {
    return this._request<L.TeamQuery, L.TeamQueryVariables>(L.TeamDocument, {
      id,
    }).then(response => {
      const data = response?.team;
      return data ? new Team(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamMembership Query
 *
 * @param request - function to call the graphql client
 */
export class TeamMembershipQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamMembership query and return a TeamMembership
   *
   * @param id - required id to pass to teamMembership
   * @returns parsed response from TeamMembershipQuery
   */
  public async fetch(id: string): Fetch<TeamMembership> {
    return this._request<L.TeamMembershipQuery, L.TeamMembershipQueryVariables>(L.TeamMembershipDocument, {
      id,
    }).then(response => {
      const data = response?.teamMembership;
      return data ? new TeamMembership(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamMemberships Query
 *
 * @param request - function to call the graphql client
 */
export class TeamMembershipsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamMemberships query and return a TeamMembershipConnection
   *
   * @param variables - variables to pass into the TeamMembershipsQuery
   * @returns parsed response from TeamMembershipsQuery
   */
  public async fetch(variables?: L.TeamMembershipsQueryVariables): Fetch<TeamMembershipConnection> {
    return this._request<L.TeamMembershipsQuery, L.TeamMembershipsQueryVariables>(
      L.TeamMembershipsDocument,
      variables
    ).then(response => {
      const data = response?.teamMemberships;
      return data
        ? new TeamMembershipConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Teams Query
 *
 * @param request - function to call the graphql client
 */
export class TeamsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Teams query and return a TeamConnection
   *
   * @param variables - variables to pass into the TeamsQuery
   * @returns parsed response from TeamsQuery
   */
  public async fetch(variables?: L.TeamsQueryVariables): Fetch<TeamConnection> {
    return this._request<L.TeamsQuery, L.TeamsQueryVariables>(L.TeamsDocument, variables).then(response => {
      const data = response?.teams;
      return data
        ? new TeamConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Template Query
 *
 * @param request - function to call the graphql client
 */
export class TemplateQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Template query and return a Template
   *
   * @param id - required id to pass to template
   * @returns parsed response from TemplateQuery
   */
  public async fetch(id: string): Fetch<Template> {
    return this._request<L.TemplateQuery, L.TemplateQueryVariables>(L.TemplateDocument, {
      id,
    }).then(response => {
      const data = response?.template;
      return data ? new Template(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Templates Query
 *
 * @param request - function to call the graphql client
 */
export class TemplatesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Templates query and return a Template list
   *
   * @returns parsed response from TemplatesQuery
   */
  public async fetch(): Fetch<Template[]> {
    return this._request<L.TemplatesQuery, L.TemplatesQueryVariables>(L.TemplatesDocument, {}).then(response => {
      const data = response?.templates;
      return data ? data.map(node => new Template(this._request, node)) : undefined;
    });
  }
}

/**
 * A fetchable User Query
 *
 * @param request - function to call the graphql client
 */
export class UserQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the User query and return a User
   *
   * @param id - required id to pass to user
   * @returns parsed response from UserQuery
   */
  public async fetch(id: string): Fetch<User> {
    return this._request<L.UserQuery, L.UserQueryVariables>(L.UserDocument, {
      id,
    }).then(response => {
      const data = response?.user;
      return data ? new User(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserSettings Query
 *
 * @param request - function to call the graphql client
 */
export class UserSettingsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserSettings query and return a UserSettings
   *
   * @returns parsed response from UserSettingsQuery
   */
  public async fetch(): Fetch<UserSettings> {
    return this._request<L.UserSettingsQuery, L.UserSettingsQueryVariables>(L.UserSettingsDocument, {}).then(
      response => {
        const data = response?.userSettings;
        return data ? new UserSettings(this._request, data) : undefined;
      }
    );
  }
}

/**
 * A fetchable Users Query
 *
 * @param request - function to call the graphql client
 */
export class UsersQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Users query and return a UserConnection
   *
   * @param variables - variables to pass into the UsersQuery
   * @returns parsed response from UsersQuery
   */
  public async fetch(variables?: L.UsersQueryVariables): Fetch<UserConnection> {
    return this._request<L.UsersQuery, L.UsersQueryVariables>(L.UsersDocument, variables).then(response => {
      const data = response?.users;
      return data
        ? new UserConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Viewer Query
 *
 * @param request - function to call the graphql client
 */
export class ViewerQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Viewer query and return a User
   *
   * @returns parsed response from ViewerQuery
   */
  public async fetch(): Fetch<User> {
    return this._request<L.ViewerQuery, L.ViewerQueryVariables>(L.ViewerDocument, {}).then(response => {
      const data = response?.viewer;
      return data ? new User(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Webhook Query
 *
 * @param request - function to call the graphql client
 */
export class WebhookQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Webhook query and return a Webhook
   *
   * @param id - required id to pass to webhook
   * @returns parsed response from WebhookQuery
   */
  public async fetch(id: string): Fetch<Webhook> {
    return this._request<L.WebhookQuery, L.WebhookQueryVariables>(L.WebhookDocument, {
      id,
    }).then(response => {
      const data = response?.webhook;
      return data ? new Webhook(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Webhooks Query
 *
 * @param request - function to call the graphql client
 */
export class WebhooksQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Webhooks query and return a WebhookConnection
   *
   * @param variables - variables to pass into the WebhooksQuery
   * @returns parsed response from WebhooksQuery
   */
  public async fetch(variables?: L.WebhooksQueryVariables): Fetch<WebhookConnection> {
    return this._request<L.WebhooksQuery, L.WebhooksQueryVariables>(L.WebhooksDocument, variables).then(response => {
      const data = response?.webhooks;
      return data
        ? new WebhookConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable WorkflowState Query
 *
 * @param request - function to call the graphql client
 */
export class WorkflowStateQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WorkflowState query and return a WorkflowState
   *
   * @param id - required id to pass to workflowState
   * @returns parsed response from WorkflowStateQuery
   */
  public async fetch(id: string): Fetch<WorkflowState> {
    return this._request<L.WorkflowStateQuery, L.WorkflowStateQueryVariables>(L.WorkflowStateDocument, {
      id,
    }).then(response => {
      const data = response?.workflowState;
      return data ? new WorkflowState(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WorkflowStates Query
 *
 * @param request - function to call the graphql client
 */
export class WorkflowStatesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WorkflowStates query and return a WorkflowStateConnection
   *
   * @param variables - variables to pass into the WorkflowStatesQuery
   * @returns parsed response from WorkflowStatesQuery
   */
  public async fetch(variables?: L.WorkflowStatesQueryVariables): Fetch<WorkflowStateConnection> {
    return this._request<L.WorkflowStatesQuery, L.WorkflowStatesQueryVariables>(
      L.WorkflowStatesDocument,
      variables
    ).then(response => {
      const data = response?.workflowStates;
      return data
        ? new WorkflowStateConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable ApiKeyCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ApiKeyCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ApiKeyCreate mutation and return a ApiKeyPayload
   *
   * @param input - required input to pass to apiKeyCreate
   * @returns parsed response from ApiKeyCreateMutation
   */
  public async fetch(input: L.ApiKeyCreateInput): Fetch<ApiKeyPayload> {
    return this._request<L.ApiKeyCreateMutation, L.ApiKeyCreateMutationVariables>(L.ApiKeyCreateDocument, {
      input,
    }).then(response => {
      const data = response?.apiKeyCreate;
      return data ? new ApiKeyPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ApiKeyDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class ApiKeyDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ApiKeyDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to apiKeyDelete
   * @returns parsed response from ApiKeyDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.ApiKeyDeleteMutation, L.ApiKeyDeleteMutationVariables>(L.ApiKeyDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.apiKeyDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable BillingEmailUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class BillingEmailUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the BillingEmailUpdate mutation and return a BillingEmailPayload
   *
   * @param input - required input to pass to billingEmailUpdate
   * @returns parsed response from BillingEmailUpdateMutation
   */
  public async fetch(input: L.BillingEmailUpdateInput): Fetch<BillingEmailPayload> {
    return this._request<L.BillingEmailUpdateMutation, L.BillingEmailUpdateMutationVariables>(
      L.BillingEmailUpdateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.billingEmailUpdate;
      return data ? new BillingEmailPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CollaborativeDocumentUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CollaborativeDocumentUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CollaborativeDocumentUpdate mutation and return a CollaborationDocumentUpdatePayload
   *
   * @param input - required input to pass to collaborativeDocumentUpdate
   * @returns parsed response from CollaborativeDocumentUpdateMutation
   */
  public async fetch(input: L.CollaborationDocumentUpdateInput): Fetch<CollaborationDocumentUpdatePayload> {
    return this._request<L.CollaborativeDocumentUpdateMutation, L.CollaborativeDocumentUpdateMutationVariables>(
      L.CollaborativeDocumentUpdateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.collaborativeDocumentUpdate;
      return data ? new CollaborationDocumentUpdatePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CommentCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CommentCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CommentCreate mutation and return a CommentPayload
   *
   * @param input - required input to pass to commentCreate
   * @returns parsed response from CommentCreateMutation
   */
  public async fetch(input: L.CommentCreateInput): Fetch<CommentPayload> {
    return this._request<L.CommentCreateMutation, L.CommentCreateMutationVariables>(L.CommentCreateDocument, {
      input,
    }).then(response => {
      const data = response?.commentCreate;
      return data ? new CommentPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CommentDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class CommentDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CommentDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to commentDelete
   * @returns parsed response from CommentDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.CommentDeleteMutation, L.CommentDeleteMutationVariables>(L.CommentDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.commentDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CommentUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CommentUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CommentUpdate mutation and return a CommentPayload
   *
   * @param id - required id to pass to commentUpdate
   * @param input - required input to pass to commentUpdate
   * @returns parsed response from CommentUpdateMutation
   */
  public async fetch(id: string, input: L.CommentUpdateInput): Fetch<CommentPayload> {
    return this._request<L.CommentUpdateMutation, L.CommentUpdateMutationVariables>(L.CommentUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.commentUpdate;
      return data ? new CommentPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ContactCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ContactCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ContactCreate mutation and return a ContactPayload
   *
   * @param input - required input to pass to contactCreate
   * @returns parsed response from ContactCreateMutation
   */
  public async fetch(input: L.ContactCreateInput): Fetch<ContactPayload> {
    return this._request<L.ContactCreateMutation, L.ContactCreateMutationVariables>(L.ContactCreateDocument, {
      input,
    }).then(response => {
      const data = response?.contactCreate;
      return data ? new ContactPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CreateCsvExportReport Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateCsvExportReportMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CreateCsvExportReport mutation and return a CreateCsvExportReportPayload
   *
   * @returns parsed response from CreateCsvExportReportMutation
   */
  public async fetch(): Fetch<CreateCsvExportReportPayload> {
    return this._request<L.CreateCsvExportReportMutation, L.CreateCsvExportReportMutationVariables>(
      L.CreateCsvExportReportDocument,
      {}
    ).then(response => {
      const data = response?.createCsvExportReport;
      return data ? new CreateCsvExportReportPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CreateOrganizationFromOnboarding Mutation
 *
 * @param request - function to call the graphql client
 */
export class CreateOrganizationFromOnboardingMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CreateOrganizationFromOnboarding mutation and return a CreateOrJoinOrganizationResponse
   *
   * @param input - required input to pass to createOrganizationFromOnboarding
   * @param variables - variables without 'input' to pass into the CreateOrganizationFromOnboardingMutation
   * @returns parsed response from CreateOrganizationFromOnboardingMutation
   */
  public async fetch(
    input: L.CreateOrganizationInput,
    variables?: Omit<L.CreateOrganizationFromOnboardingMutationVariables, "input">
  ): Fetch<CreateOrJoinOrganizationResponse> {
    return this._request<
      L.CreateOrganizationFromOnboardingMutation,
      L.CreateOrganizationFromOnboardingMutationVariables
    >(L.CreateOrganizationFromOnboardingDocument, {
      input,
      ...variables,
    }).then(response => {
      const data = response?.createOrganizationFromOnboarding;
      return data ? new CreateOrJoinOrganizationResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CustomViewCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CustomViewCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CustomViewCreate mutation and return a CustomViewPayload
   *
   * @param input - required input to pass to customViewCreate
   * @returns parsed response from CustomViewCreateMutation
   */
  public async fetch(input: L.CustomViewCreateInput): Fetch<CustomViewPayload> {
    return this._request<L.CustomViewCreateMutation, L.CustomViewCreateMutationVariables>(L.CustomViewCreateDocument, {
      input,
    }).then(response => {
      const data = response?.customViewCreate;
      return data ? new CustomViewPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CustomViewDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class CustomViewDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CustomViewDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to customViewDelete
   * @returns parsed response from CustomViewDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.CustomViewDeleteMutation, L.CustomViewDeleteMutationVariables>(L.CustomViewDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.customViewDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CustomViewUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CustomViewUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CustomViewUpdate mutation and return a CustomViewPayload
   *
   * @param id - required id to pass to customViewUpdate
   * @param input - required input to pass to customViewUpdate
   * @returns parsed response from CustomViewUpdateMutation
   */
  public async fetch(id: string, input: L.CustomViewUpdateInput): Fetch<CustomViewPayload> {
    return this._request<L.CustomViewUpdateMutation, L.CustomViewUpdateMutationVariables>(L.CustomViewUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.customViewUpdate;
      return data ? new CustomViewPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CycleArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class CycleArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CycleArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to cycleArchive
   * @returns parsed response from CycleArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.CycleArchiveMutation, L.CycleArchiveMutationVariables>(L.CycleArchiveDocument, {
      id,
    }).then(response => {
      const data = response?.cycleArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CycleCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CycleCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CycleCreate mutation and return a CyclePayload
   *
   * @param input - required input to pass to cycleCreate
   * @returns parsed response from CycleCreateMutation
   */
  public async fetch(input: L.CycleCreateInput): Fetch<CyclePayload> {
    return this._request<L.CycleCreateMutation, L.CycleCreateMutationVariables>(L.CycleCreateDocument, {
      input,
    }).then(response => {
      const data = response?.cycleCreate;
      return data ? new CyclePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CycleUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class CycleUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the CycleUpdate mutation and return a CyclePayload
   *
   * @param id - required id to pass to cycleUpdate
   * @param input - required input to pass to cycleUpdate
   * @returns parsed response from CycleUpdateMutation
   */
  public async fetch(id: string, input: L.CycleUpdateInput): Fetch<CyclePayload> {
    return this._request<L.CycleUpdateMutation, L.CycleUpdateMutationVariables>(L.CycleUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.cycleUpdate;
      return data ? new CyclePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable DebugCreateSamlOrg Mutation
 *
 * @param request - function to call the graphql client
 */
export class DebugCreateSamlOrgMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the DebugCreateSamlOrg mutation and return a DebugPayload
   *
   * @returns parsed response from DebugCreateSamlOrgMutation
   */
  public async fetch(): Fetch<DebugPayload> {
    return this._request<L.DebugCreateSamlOrgMutation, L.DebugCreateSamlOrgMutationVariables>(
      L.DebugCreateSamlOrgDocument,
      {}
    ).then(response => {
      const data = response?.debugCreateSAMLOrg;
      return data ? new DebugPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable DebugFailWithInternalError Mutation
 *
 * @param request - function to call the graphql client
 */
export class DebugFailWithInternalErrorMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the DebugFailWithInternalError mutation and return a DebugPayload
   *
   * @returns parsed response from DebugFailWithInternalErrorMutation
   */
  public async fetch(): Fetch<DebugPayload> {
    return this._request<L.DebugFailWithInternalErrorMutation, L.DebugFailWithInternalErrorMutationVariables>(
      L.DebugFailWithInternalErrorDocument,
      {}
    ).then(response => {
      const data = response?.debugFailWithInternalError;
      return data ? new DebugPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable DebugFailWithWarning Mutation
 *
 * @param request - function to call the graphql client
 */
export class DebugFailWithWarningMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the DebugFailWithWarning mutation and return a DebugPayload
   *
   * @returns parsed response from DebugFailWithWarningMutation
   */
  public async fetch(): Fetch<DebugPayload> {
    return this._request<L.DebugFailWithWarningMutation, L.DebugFailWithWarningMutationVariables>(
      L.DebugFailWithWarningDocument,
      {}
    ).then(response => {
      const data = response?.debugFailWithWarning;
      return data ? new DebugPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable EmailTokenUserAccountAuth Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmailTokenUserAccountAuthMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the EmailTokenUserAccountAuth mutation and return a AuthResolverResponse
   *
   * @param input - required input to pass to emailTokenUserAccountAuth
   * @returns parsed response from EmailTokenUserAccountAuthMutation
   */
  public async fetch(input: L.TokenUserAccountAuthInput): Fetch<AuthResolverResponse> {
    return this._request<L.EmailTokenUserAccountAuthMutation, L.EmailTokenUserAccountAuthMutationVariables>(
      L.EmailTokenUserAccountAuthDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.emailTokenUserAccountAuth;
      return data ? new AuthResolverResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable EmailUnsubscribe Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmailUnsubscribeMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the EmailUnsubscribe mutation and return a EmailUnsubscribePayload
   *
   * @param input - required input to pass to emailUnsubscribe
   * @returns parsed response from EmailUnsubscribeMutation
   */
  public async fetch(input: L.EmailUnsubscribeInput): Fetch<EmailUnsubscribePayload> {
    return this._request<L.EmailUnsubscribeMutation, L.EmailUnsubscribeMutationVariables>(L.EmailUnsubscribeDocument, {
      input,
    }).then(response => {
      const data = response?.emailUnsubscribe;
      return data ? new EmailUnsubscribePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable EmailUserAccountAuthChallenge Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmailUserAccountAuthChallengeMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the EmailUserAccountAuthChallenge mutation and return a EmailUserAccountAuthChallengeResponse
   *
   * @param input - required input to pass to emailUserAccountAuthChallenge
   * @returns parsed response from EmailUserAccountAuthChallengeMutation
   */
  public async fetch(input: L.EmailUserAccountAuthChallengeInput): Fetch<EmailUserAccountAuthChallengeResponse> {
    return this._request<L.EmailUserAccountAuthChallengeMutation, L.EmailUserAccountAuthChallengeMutationVariables>(
      L.EmailUserAccountAuthChallengeDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.emailUserAccountAuthChallenge;
      return data ? new EmailUserAccountAuthChallengeResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable EmojiCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmojiCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the EmojiCreate mutation and return a EmojiPayload
   *
   * @param input - required input to pass to emojiCreate
   * @returns parsed response from EmojiCreateMutation
   */
  public async fetch(input: L.EmojiCreateInput): Fetch<EmojiPayload> {
    return this._request<L.EmojiCreateMutation, L.EmojiCreateMutationVariables>(L.EmojiCreateDocument, {
      input,
    }).then(response => {
      const data = response?.emojiCreate;
      return data ? new EmojiPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable EmojiDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class EmojiDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the EmojiDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to emojiDelete
   * @returns parsed response from EmojiDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.EmojiDeleteMutation, L.EmojiDeleteMutationVariables>(L.EmojiDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.emojiDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable EventCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class EventCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the EventCreate mutation and return a EventPayload
   *
   * @param input - required input to pass to eventCreate
   * @returns parsed response from EventCreateMutation
   */
  public async fetch(input: L.EventCreateInput): Fetch<EventPayload> {
    return this._request<L.EventCreateMutation, L.EventCreateMutationVariables>(L.EventCreateDocument, {
      input,
    }).then(response => {
      const data = response?.eventCreate;
      return data ? new EventPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable FavoriteCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class FavoriteCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the FavoriteCreate mutation and return a FavoritePayload
   *
   * @param input - required input to pass to favoriteCreate
   * @returns parsed response from FavoriteCreateMutation
   */
  public async fetch(input: L.FavoriteCreateInput): Fetch<FavoritePayload> {
    return this._request<L.FavoriteCreateMutation, L.FavoriteCreateMutationVariables>(L.FavoriteCreateDocument, {
      input,
    }).then(response => {
      const data = response?.favoriteCreate;
      return data ? new FavoritePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable FavoriteDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class FavoriteDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the FavoriteDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to favoriteDelete
   * @returns parsed response from FavoriteDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.FavoriteDeleteMutation, L.FavoriteDeleteMutationVariables>(L.FavoriteDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.favoriteDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable FavoriteUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class FavoriteUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the FavoriteUpdate mutation and return a FavoritePayload
   *
   * @param id - required id to pass to favoriteUpdate
   * @param input - required input to pass to favoriteUpdate
   * @returns parsed response from FavoriteUpdateMutation
   */
  public async fetch(id: string, input: L.FavoriteUpdateInput): Fetch<FavoritePayload> {
    return this._request<L.FavoriteUpdateMutation, L.FavoriteUpdateMutationVariables>(L.FavoriteUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.favoriteUpdate;
      return data ? new FavoritePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable FeedbackCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class FeedbackCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the FeedbackCreate mutation and return a FeedbackPayload
   *
   * @param input - required input to pass to feedbackCreate
   * @returns parsed response from FeedbackCreateMutation
   */
  public async fetch(input: L.FeedbackCreateInput): Fetch<FeedbackPayload> {
    return this._request<L.FeedbackCreateMutation, L.FeedbackCreateMutationVariables>(L.FeedbackCreateDocument, {
      input,
    }).then(response => {
      const data = response?.feedbackCreate;
      return data ? new FeedbackPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable FileUpload Mutation
 *
 * @param request - function to call the graphql client
 */
export class FileUploadMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the FileUpload mutation and return a UploadPayload
   *
   * @param contentType - required contentType to pass to fileUpload
   * @param filename - required filename to pass to fileUpload
   * @param size - required size to pass to fileUpload
   * @param variables - variables without 'contentType', 'filename', 'size' to pass into the FileUploadMutation
   * @returns parsed response from FileUploadMutation
   */
  public async fetch(
    contentType: string,
    filename: string,
    size: number,
    variables?: Omit<L.FileUploadMutationVariables, "contentType" | "filename" | "size">
  ): Fetch<UploadPayload> {
    return this._request<L.FileUploadMutation, L.FileUploadMutationVariables>(L.FileUploadDocument, {
      contentType,
      filename,
      size,
      ...variables,
    }).then(response => {
      const data = response?.fileUpload;
      return data ? new UploadPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable GoogleUserAccountAuth Mutation
 *
 * @param request - function to call the graphql client
 */
export class GoogleUserAccountAuthMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the GoogleUserAccountAuth mutation and return a AuthResolverResponse
   *
   * @param input - required input to pass to googleUserAccountAuth
   * @returns parsed response from GoogleUserAccountAuthMutation
   */
  public async fetch(input: L.GoogleUserAccountAuthInput): Fetch<AuthResolverResponse> {
    return this._request<L.GoogleUserAccountAuthMutation, L.GoogleUserAccountAuthMutationVariables>(
      L.GoogleUserAccountAuthDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.googleUserAccountAuth;
      return data ? new AuthResolverResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ImageUploadFromUrl Mutation
 *
 * @param request - function to call the graphql client
 */
export class ImageUploadFromUrlMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ImageUploadFromUrl mutation and return a ImageUploadFromUrlPayload
   *
   * @param url - required url to pass to imageUploadFromUrl
   * @returns parsed response from ImageUploadFromUrlMutation
   */
  public async fetch(url: string): Fetch<ImageUploadFromUrlPayload> {
    return this._request<L.ImageUploadFromUrlMutation, L.ImageUploadFromUrlMutationVariables>(
      L.ImageUploadFromUrlDocument,
      {
        url,
      }
    ).then(response => {
      const data = response?.imageUploadFromUrl;
      return data ? new ImageUploadFromUrlPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to integrationDelete
   * @returns parsed response from IntegrationDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.IntegrationDeleteMutation, L.IntegrationDeleteMutationVariables>(
      L.IntegrationDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.integrationDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationFigma Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationFigmaMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationFigma mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationFigma
   * @param redirectUri - required redirectUri to pass to integrationFigma
   * @returns parsed response from IntegrationFigmaMutation
   */
  public async fetch(code: string, redirectUri: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationFigmaMutation, L.IntegrationFigmaMutationVariables>(L.IntegrationFigmaDocument, {
      code,
      redirectUri,
    }).then(response => {
      const data = response?.integrationFigma;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationGithubConnect Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationGithubConnectMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationGithubConnect mutation and return a IntegrationPayload
   *
   * @param installationId - required installationId to pass to integrationGithubConnect
   * @returns parsed response from IntegrationGithubConnectMutation
   */
  public async fetch(installationId: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationGithubConnectMutation, L.IntegrationGithubConnectMutationVariables>(
      L.IntegrationGithubConnectDocument,
      {
        installationId,
      }
    ).then(response => {
      const data = response?.integrationGithubConnect;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationGitlabConnect Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationGitlabConnectMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationGitlabConnect mutation and return a IntegrationPayload
   *
   * @param accessToken - required accessToken to pass to integrationGitlabConnect
   * @param gitlabUrl - required gitlabUrl to pass to integrationGitlabConnect
   * @returns parsed response from IntegrationGitlabConnectMutation
   */
  public async fetch(accessToken: string, gitlabUrl: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationGitlabConnectMutation, L.IntegrationGitlabConnectMutationVariables>(
      L.IntegrationGitlabConnectDocument,
      {
        accessToken,
        gitlabUrl,
      }
    ).then(response => {
      const data = response?.integrationGitlabConnect;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationGoogleSheets Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationGoogleSheetsMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationGoogleSheets mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationGoogleSheets
   * @returns parsed response from IntegrationGoogleSheetsMutation
   */
  public async fetch(code: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationGoogleSheetsMutation, L.IntegrationGoogleSheetsMutationVariables>(
      L.IntegrationGoogleSheetsDocument,
      {
        code,
      }
    ).then(response => {
      const data = response?.integrationGoogleSheets;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResourceArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationResourceArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationResourceArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to integrationResourceArchive
   * @returns parsed response from IntegrationResourceArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.IntegrationResourceArchiveMutation, L.IntegrationResourceArchiveMutationVariables>(
      L.IntegrationResourceArchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.integrationResourceArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationSentryConnect Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationSentryConnectMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationSentryConnect mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationSentryConnect
   * @param installationId - required installationId to pass to integrationSentryConnect
   * @param organizationSlug - required organizationSlug to pass to integrationSentryConnect
   * @returns parsed response from IntegrationSentryConnectMutation
   */
  public async fetch(code: string, installationId: string, organizationSlug: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationSentryConnectMutation, L.IntegrationSentryConnectMutationVariables>(
      L.IntegrationSentryConnectDocument,
      {
        code,
        installationId,
        organizationSlug,
      }
    ).then(response => {
      const data = response?.integrationSentryConnect;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationSlack Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationSlackMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationSlack mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationSlack
   * @param redirectUri - required redirectUri to pass to integrationSlack
   * @param variables - variables without 'code', 'redirectUri' to pass into the IntegrationSlackMutation
   * @returns parsed response from IntegrationSlackMutation
   */
  public async fetch(
    code: string,
    redirectUri: string,
    variables?: Omit<L.IntegrationSlackMutationVariables, "code" | "redirectUri">
  ): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationSlackMutation, L.IntegrationSlackMutationVariables>(L.IntegrationSlackDocument, {
      code,
      redirectUri,
      ...variables,
    }).then(response => {
      const data = response?.integrationSlack;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationSlackImportEmojis Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationSlackImportEmojisMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationSlackImportEmojis mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackImportEmojis
   * @param redirectUri - required redirectUri to pass to integrationSlackImportEmojis
   * @returns parsed response from IntegrationSlackImportEmojisMutation
   */
  public async fetch(code: string, redirectUri: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationSlackImportEmojisMutation, L.IntegrationSlackImportEmojisMutationVariables>(
      L.IntegrationSlackImportEmojisDocument,
      {
        code,
        redirectUri,
      }
    ).then(response => {
      const data = response?.integrationSlackImportEmojis;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationSlackPersonal Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationSlackPersonalMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationSlackPersonal mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackPersonal
   * @param redirectUri - required redirectUri to pass to integrationSlackPersonal
   * @returns parsed response from IntegrationSlackPersonalMutation
   */
  public async fetch(code: string, redirectUri: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationSlackPersonalMutation, L.IntegrationSlackPersonalMutationVariables>(
      L.IntegrationSlackPersonalDocument,
      {
        code,
        redirectUri,
      }
    ).then(response => {
      const data = response?.integrationSlackPersonal;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationSlackPost Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationSlackPostMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationSlackPost mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackPost
   * @param redirectUri - required redirectUri to pass to integrationSlackPost
   * @param teamId - required teamId to pass to integrationSlackPost
   * @param variables - variables without 'code', 'redirectUri', 'teamId' to pass into the IntegrationSlackPostMutation
   * @returns parsed response from IntegrationSlackPostMutation
   */
  public async fetch(
    code: string,
    redirectUri: string,
    teamId: string,
    variables?: Omit<L.IntegrationSlackPostMutationVariables, "code" | "redirectUri" | "teamId">
  ): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationSlackPostMutation, L.IntegrationSlackPostMutationVariables>(
      L.IntegrationSlackPostDocument,
      {
        code,
        redirectUri,
        teamId,
        ...variables,
      }
    ).then(response => {
      const data = response?.integrationSlackPost;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationSlackProjectPost Mutation
 *
 * @param request - function to call the graphql client
 */
export class IntegrationSlackProjectPostMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IntegrationSlackProjectPost mutation and return a IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackProjectPost
   * @param projectId - required projectId to pass to integrationSlackProjectPost
   * @param redirectUri - required redirectUri to pass to integrationSlackProjectPost
   * @returns parsed response from IntegrationSlackProjectPostMutation
   */
  public async fetch(code: string, projectId: string, redirectUri: string): Fetch<IntegrationPayload> {
    return this._request<L.IntegrationSlackProjectPostMutation, L.IntegrationSlackProjectPostMutationVariables>(
      L.IntegrationSlackProjectPostDocument,
      {
        code,
        projectId,
        redirectUri,
      }
    ).then(response => {
      const data = response?.integrationSlackProjectPost;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to issueArchive
   * @returns parsed response from IssueArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.IssueArchiveMutation, L.IssueArchiveMutationVariables>(L.IssueArchiveDocument, {
      id,
    }).then(response => {
      const data = response?.issueArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueCreate mutation and return a IssuePayload
   *
   * @param input - required input to pass to issueCreate
   * @returns parsed response from IssueCreateMutation
   */
  public async fetch(input: L.IssueCreateInput): Fetch<IssuePayload> {
    return this._request<L.IssueCreateMutation, L.IssueCreateMutationVariables>(L.IssueCreateDocument, {
      input,
    }).then(response => {
      const data = response?.issueCreate;
      return data ? new IssuePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueImportCreateGithub Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueImportCreateGithubMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueImportCreateGithub mutation and return a IssueImportPayload
   *
   * @param githubRepoName - required githubRepoName to pass to issueImportCreateGithub
   * @param githubRepoOwner - required githubRepoOwner to pass to issueImportCreateGithub
   * @param githubToken - required githubToken to pass to issueImportCreateGithub
   * @param teamId - required teamId to pass to issueImportCreateGithub
   * @returns parsed response from IssueImportCreateGithubMutation
   */
  public async fetch(
    githubRepoName: string,
    githubRepoOwner: string,
    githubToken: string,
    teamId: string
  ): Fetch<IssueImportPayload> {
    return this._request<L.IssueImportCreateGithubMutation, L.IssueImportCreateGithubMutationVariables>(
      L.IssueImportCreateGithubDocument,
      {
        githubRepoName,
        githubRepoOwner,
        githubToken,
        teamId,
      }
    ).then(response => {
      const data = response?.issueImportCreateGithub;
      return data ? new IssueImportPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueLabelArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueLabelArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueLabelArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to issueLabelArchive
   * @returns parsed response from IssueLabelArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.IssueLabelArchiveMutation, L.IssueLabelArchiveMutationVariables>(
      L.IssueLabelArchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.issueLabelArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueLabelCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueLabelCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueLabelCreate mutation and return a IssueLabelPayload
   *
   * @param input - required input to pass to issueLabelCreate
   * @returns parsed response from IssueLabelCreateMutation
   */
  public async fetch(input: L.IssueLabelCreateInput): Fetch<IssueLabelPayload> {
    return this._request<L.IssueLabelCreateMutation, L.IssueLabelCreateMutationVariables>(L.IssueLabelCreateDocument, {
      input,
    }).then(response => {
      const data = response?.issueLabelCreate;
      return data ? new IssueLabelPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueLabelUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueLabelUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueLabelUpdate mutation and return a IssueLabelPayload
   *
   * @param id - required id to pass to issueLabelUpdate
   * @param input - required input to pass to issueLabelUpdate
   * @returns parsed response from IssueLabelUpdateMutation
   */
  public async fetch(id: string, input: L.IssueLabelUpdateInput): Fetch<IssueLabelPayload> {
    return this._request<L.IssueLabelUpdateMutation, L.IssueLabelUpdateMutationVariables>(L.IssueLabelUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.issueLabelUpdate;
      return data ? new IssueLabelPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueRelationCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueRelationCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueRelationCreate mutation and return a IssueRelationPayload
   *
   * @param input - required input to pass to issueRelationCreate
   * @returns parsed response from IssueRelationCreateMutation
   */
  public async fetch(input: L.IssueRelationCreateInput): Fetch<IssueRelationPayload> {
    return this._request<L.IssueRelationCreateMutation, L.IssueRelationCreateMutationVariables>(
      L.IssueRelationCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.issueRelationCreate;
      return data ? new IssueRelationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueRelationDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueRelationDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueRelationDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to issueRelationDelete
   * @returns parsed response from IssueRelationDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.IssueRelationDeleteMutation, L.IssueRelationDeleteMutationVariables>(
      L.IssueRelationDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.issueRelationDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueRelationUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueRelationUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueRelationUpdate mutation and return a IssueRelationPayload
   *
   * @param id - required id to pass to issueRelationUpdate
   * @param input - required input to pass to issueRelationUpdate
   * @returns parsed response from IssueRelationUpdateMutation
   */
  public async fetch(id: string, input: L.IssueRelationUpdateInput): Fetch<IssueRelationPayload> {
    return this._request<L.IssueRelationUpdateMutation, L.IssueRelationUpdateMutationVariables>(
      L.IssueRelationUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.issueRelationUpdate;
      return data ? new IssueRelationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueUnarchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueUnarchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueUnarchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to issueUnarchive
   * @returns parsed response from IssueUnarchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.IssueUnarchiveMutation, L.IssueUnarchiveMutationVariables>(L.IssueUnarchiveDocument, {
      id,
    }).then(response => {
      const data = response?.issueUnarchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IssueUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class IssueUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the IssueUpdate mutation and return a IssuePayload
   *
   * @param id - required id to pass to issueUpdate
   * @param input - required input to pass to issueUpdate
   * @returns parsed response from IssueUpdateMutation
   */
  public async fetch(id: string, input: L.IssueUpdateInput): Fetch<IssuePayload> {
    return this._request<L.IssueUpdateMutation, L.IssueUpdateMutationVariables>(L.IssueUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.issueUpdate;
      return data ? new IssuePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable JoinOrganizationFromOnboarding Mutation
 *
 * @param request - function to call the graphql client
 */
export class JoinOrganizationFromOnboardingMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the JoinOrganizationFromOnboarding mutation and return a CreateOrJoinOrganizationResponse
   *
   * @param input - required input to pass to joinOrganizationFromOnboarding
   * @returns parsed response from JoinOrganizationFromOnboardingMutation
   */
  public async fetch(input: L.JoinOrganizationInput): Fetch<CreateOrJoinOrganizationResponse> {
    return this._request<L.JoinOrganizationFromOnboardingMutation, L.JoinOrganizationFromOnboardingMutationVariables>(
      L.JoinOrganizationFromOnboardingDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.joinOrganizationFromOnboarding;
      return data ? new CreateOrJoinOrganizationResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable LeaveOrganization Mutation
 *
 * @param request - function to call the graphql client
 */
export class LeaveOrganizationMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the LeaveOrganization mutation and return a CreateOrJoinOrganizationResponse
   *
   * @param organizationId - required organizationId to pass to leaveOrganization
   * @returns parsed response from LeaveOrganizationMutation
   */
  public async fetch(organizationId: string): Fetch<CreateOrJoinOrganizationResponse> {
    return this._request<L.LeaveOrganizationMutation, L.LeaveOrganizationMutationVariables>(
      L.LeaveOrganizationDocument,
      {
        organizationId,
      }
    ).then(response => {
      const data = response?.leaveOrganization;
      return data ? new CreateOrJoinOrganizationResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable MilestoneCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class MilestoneCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the MilestoneCreate mutation and return a MilestonePayload
   *
   * @param input - required input to pass to milestoneCreate
   * @returns parsed response from MilestoneCreateMutation
   */
  public async fetch(input: L.MilestoneCreateInput): Fetch<MilestonePayload> {
    return this._request<L.MilestoneCreateMutation, L.MilestoneCreateMutationVariables>(L.MilestoneCreateDocument, {
      input,
    }).then(response => {
      const data = response?.milestoneCreate;
      return data ? new MilestonePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable MilestoneDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class MilestoneDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the MilestoneDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to milestoneDelete
   * @returns parsed response from MilestoneDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.MilestoneDeleteMutation, L.MilestoneDeleteMutationVariables>(L.MilestoneDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.milestoneDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable MilestoneUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class MilestoneUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the MilestoneUpdate mutation and return a MilestonePayload
   *
   * @param id - required id to pass to milestoneUpdate
   * @param input - required input to pass to milestoneUpdate
   * @returns parsed response from MilestoneUpdateMutation
   */
  public async fetch(id: string, input: L.MilestoneUpdateInput): Fetch<MilestonePayload> {
    return this._request<L.MilestoneUpdateMutation, L.MilestoneUpdateMutationVariables>(L.MilestoneUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.milestoneUpdate;
      return data ? new MilestonePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to notificationArchive
   * @returns parsed response from NotificationArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.NotificationArchiveMutation, L.NotificationArchiveMutationVariables>(
      L.NotificationArchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.notificationArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationCreate mutation and return a NotificationPayload
   *
   * @param id - required id to pass to notificationCreate
   * @param input - required input to pass to notificationCreate
   * @returns parsed response from NotificationCreateMutation
   */
  public async fetch(id: string, input: L.NotificationUpdateInput): Fetch<NotificationPayload> {
    return this._request<L.NotificationCreateMutation, L.NotificationCreateMutationVariables>(
      L.NotificationCreateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.notificationCreate;
      return data ? new NotificationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to notificationDelete
   * @returns parsed response from NotificationDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.NotificationDeleteMutation, L.NotificationDeleteMutationVariables>(
      L.NotificationDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.notificationDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationSubscriptionCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationSubscriptionCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationSubscriptionCreate mutation and return a NotificationSubscriptionPayload
   *
   * @param input - required input to pass to notificationSubscriptionCreate
   * @returns parsed response from NotificationSubscriptionCreateMutation
   */
  public async fetch(input: L.NotificationSubscriptionCreateInput): Fetch<NotificationSubscriptionPayload> {
    return this._request<L.NotificationSubscriptionCreateMutation, L.NotificationSubscriptionCreateMutationVariables>(
      L.NotificationSubscriptionCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.notificationSubscriptionCreate;
      return data ? new NotificationSubscriptionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationSubscriptionDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationSubscriptionDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationSubscriptionDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to notificationSubscriptionDelete
   * @returns parsed response from NotificationSubscriptionDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.NotificationSubscriptionDeleteMutation, L.NotificationSubscriptionDeleteMutationVariables>(
      L.NotificationSubscriptionDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.notificationSubscriptionDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationUnarchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationUnarchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationUnarchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to notificationUnarchive
   * @returns parsed response from NotificationUnarchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.NotificationUnarchiveMutation, L.NotificationUnarchiveMutationVariables>(
      L.NotificationUnarchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.notificationUnarchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable NotificationUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class NotificationUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the NotificationUpdate mutation and return a NotificationPayload
   *
   * @param id - required id to pass to notificationUpdate
   * @param input - required input to pass to notificationUpdate
   * @returns parsed response from NotificationUpdateMutation
   */
  public async fetch(id: string, input: L.NotificationUpdateInput): Fetch<NotificationPayload> {
    return this._request<L.NotificationUpdateMutation, L.NotificationUpdateMutationVariables>(
      L.NotificationUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.notificationUpdate;
      return data ? new NotificationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OauthClientArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class OauthClientArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OauthClientArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to oauthClientArchive
   * @returns parsed response from OauthClientArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.OauthClientArchiveMutation, L.OauthClientArchiveMutationVariables>(
      L.OauthClientArchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.oauthClientArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OauthClientCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class OauthClientCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OauthClientCreate mutation and return a OauthClientPayload
   *
   * @param input - required input to pass to oauthClientCreate
   * @returns parsed response from OauthClientCreateMutation
   */
  public async fetch(input: L.OauthClientCreateInput): Fetch<OauthClientPayload> {
    return this._request<L.OauthClientCreateMutation, L.OauthClientCreateMutationVariables>(
      L.OauthClientCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.oauthClientCreate;
      return data ? new OauthClientPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OauthClientRotateSecret Mutation
 *
 * @param request - function to call the graphql client
 */
export class OauthClientRotateSecretMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OauthClientRotateSecret mutation and return a RotateSecretPayload
   *
   * @param id - required id to pass to oauthClientRotateSecret
   * @returns parsed response from OauthClientRotateSecretMutation
   */
  public async fetch(id: string): Fetch<RotateSecretPayload> {
    return this._request<L.OauthClientRotateSecretMutation, L.OauthClientRotateSecretMutationVariables>(
      L.OauthClientRotateSecretDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.oauthClientRotateSecret;
      return data ? new RotateSecretPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OauthClientUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class OauthClientUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OauthClientUpdate mutation and return a OauthClientPayload
   *
   * @param id - required id to pass to oauthClientUpdate
   * @param input - required input to pass to oauthClientUpdate
   * @returns parsed response from OauthClientUpdateMutation
   */
  public async fetch(id: string, input: L.OauthClientUpdateInput): Fetch<OauthClientPayload> {
    return this._request<L.OauthClientUpdateMutation, L.OauthClientUpdateMutationVariables>(
      L.OauthClientUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.oauthClientUpdate;
      return data ? new OauthClientPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OauthTokenRevoke Mutation
 *
 * @param request - function to call the graphql client
 */
export class OauthTokenRevokeMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OauthTokenRevoke mutation and return a OauthTokenRevokePayload
   *
   * @param appId - required appId to pass to oauthTokenRevoke
   * @param scope - required scope to pass to oauthTokenRevoke
   * @returns parsed response from OauthTokenRevokeMutation
   */
  public async fetch(appId: string, scope: string[]): Fetch<OauthTokenRevokePayload> {
    return this._request<L.OauthTokenRevokeMutation, L.OauthTokenRevokeMutationVariables>(L.OauthTokenRevokeDocument, {
      appId,
      scope,
    }).then(response => {
      const data = response?.oauthTokenRevoke;
      return data ? new OauthTokenRevokePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationDelete mutation and return a OrganizationDeletePayload
   *
   * @param input - required input to pass to organizationDelete
   * @returns parsed response from OrganizationDeleteMutation
   */
  public async fetch(input: L.DeleteOrganizationInput): Fetch<OrganizationDeletePayload> {
    return this._request<L.OrganizationDeleteMutation, L.OrganizationDeleteMutationVariables>(
      L.OrganizationDeleteDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.organizationDelete;
      return data ? new OrganizationDeletePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationDeleteChallenge Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationDeleteChallengeMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationDeleteChallenge mutation and return a OrganizationDeletePayload
   *
   * @returns parsed response from OrganizationDeleteChallengeMutation
   */
  public async fetch(): Fetch<OrganizationDeletePayload> {
    return this._request<L.OrganizationDeleteChallengeMutation, L.OrganizationDeleteChallengeMutationVariables>(
      L.OrganizationDeleteChallengeDocument,
      {}
    ).then(response => {
      const data = response?.organizationDeleteChallenge;
      return data ? new OrganizationDeletePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationDomainCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationDomainCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationDomainCreate mutation and return a OrganizationDomainPayload
   *
   * @param input - required input to pass to organizationDomainCreate
   * @returns parsed response from OrganizationDomainCreateMutation
   */
  public async fetch(input: L.OrganizationDomainCreateInput): Fetch<OrganizationDomainPayload> {
    return this._request<L.OrganizationDomainCreateMutation, L.OrganizationDomainCreateMutationVariables>(
      L.OrganizationDomainCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.organizationDomainCreate;
      return data ? new OrganizationDomainPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationDomainDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationDomainDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationDomainDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to organizationDomainDelete
   * @returns parsed response from OrganizationDomainDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.OrganizationDomainDeleteMutation, L.OrganizationDomainDeleteMutationVariables>(
      L.OrganizationDomainDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.organizationDomainDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationDomainVerify Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationDomainVerifyMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationDomainVerify mutation and return a OrganizationDomainPayload
   *
   * @param input - required input to pass to organizationDomainVerify
   * @returns parsed response from OrganizationDomainVerifyMutation
   */
  public async fetch(input: L.OrganizationDomainVerificationInput): Fetch<OrganizationDomainPayload> {
    return this._request<L.OrganizationDomainVerifyMutation, L.OrganizationDomainVerifyMutationVariables>(
      L.OrganizationDomainVerifyDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.organizationDomainVerify;
      return data ? new OrganizationDomainPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationInviteCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationInviteCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationInviteCreate mutation and return a OrganizationInvitePayload
   *
   * @param input - required input to pass to organizationInviteCreate
   * @returns parsed response from OrganizationInviteCreateMutation
   */
  public async fetch(input: L.OrganizationInviteCreateInput): Fetch<OrganizationInvitePayload> {
    return this._request<L.OrganizationInviteCreateMutation, L.OrganizationInviteCreateMutationVariables>(
      L.OrganizationInviteCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.organizationInviteCreate;
      return data ? new OrganizationInvitePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationInviteDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationInviteDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationInviteDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to organizationInviteDelete
   * @returns parsed response from OrganizationInviteDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.OrganizationInviteDeleteMutation, L.OrganizationInviteDeleteMutationVariables>(
      L.OrganizationInviteDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.organizationInviteDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable OrganizationUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class OrganizationUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the OrganizationUpdate mutation and return a OrganizationPayload
   *
   * @param input - required input to pass to organizationUpdate
   * @returns parsed response from OrganizationUpdateMutation
   */
  public async fetch(input: L.UpdateOrganizationInput): Fetch<OrganizationPayload> {
    return this._request<L.OrganizationUpdateMutation, L.OrganizationUpdateMutationVariables>(
      L.OrganizationUpdateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.organizationUpdate;
      return data ? new OrganizationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class ProjectArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to projectArchive
   * @returns parsed response from ProjectArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.ProjectArchiveMutation, L.ProjectArchiveMutationVariables>(L.ProjectArchiveDocument, {
      id,
    }).then(response => {
      const data = response?.projectArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ProjectCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectCreate mutation and return a ProjectPayload
   *
   * @param input - required input to pass to projectCreate
   * @returns parsed response from ProjectCreateMutation
   */
  public async fetch(input: L.ProjectCreateInput): Fetch<ProjectPayload> {
    return this._request<L.ProjectCreateMutation, L.ProjectCreateMutationVariables>(L.ProjectCreateDocument, {
      input,
    }).then(response => {
      const data = response?.projectCreate;
      return data ? new ProjectPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectLinkCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ProjectLinkCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectLinkCreate mutation and return a ProjectLinkPayload
   *
   * @param input - required input to pass to projectLinkCreate
   * @returns parsed response from ProjectLinkCreateMutation
   */
  public async fetch(input: L.ProjectLinkCreateInput): Fetch<ProjectLinkPayload> {
    return this._request<L.ProjectLinkCreateMutation, L.ProjectLinkCreateMutationVariables>(
      L.ProjectLinkCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.projectLinkCreate;
      return data ? new ProjectLinkPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectLinkDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class ProjectLinkDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectLinkDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to projectLinkDelete
   * @returns parsed response from ProjectLinkDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.ProjectLinkDeleteMutation, L.ProjectLinkDeleteMutationVariables>(
      L.ProjectLinkDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.projectLinkDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ProjectUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ProjectUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ProjectUpdate mutation and return a ProjectPayload
   *
   * @param id - required id to pass to projectUpdate
   * @param input - required input to pass to projectUpdate
   * @returns parsed response from ProjectUpdateMutation
   */
  public async fetch(id: string, input: L.ProjectUpdateInput): Fetch<ProjectPayload> {
    return this._request<L.ProjectUpdateMutation, L.ProjectUpdateMutationVariables>(L.ProjectUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.projectUpdate;
      return data ? new ProjectPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable PushSubscriptionCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class PushSubscriptionCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the PushSubscriptionCreate mutation and return a PushSubscriptionPayload
   *
   * @param input - required input to pass to pushSubscriptionCreate
   * @returns parsed response from PushSubscriptionCreateMutation
   */
  public async fetch(input: L.PushSubscriptionCreateInput): Fetch<PushSubscriptionPayload> {
    return this._request<L.PushSubscriptionCreateMutation, L.PushSubscriptionCreateMutationVariables>(
      L.PushSubscriptionCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.pushSubscriptionCreate;
      return data ? new PushSubscriptionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable PushSubscriptionDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class PushSubscriptionDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the PushSubscriptionDelete mutation and return a PushSubscriptionPayload
   *
   * @param id - required id to pass to pushSubscriptionDelete
   * @returns parsed response from PushSubscriptionDeleteMutation
   */
  public async fetch(id: string): Fetch<PushSubscriptionPayload> {
    return this._request<L.PushSubscriptionDeleteMutation, L.PushSubscriptionDeleteMutationVariables>(
      L.PushSubscriptionDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.pushSubscriptionDelete;
      return data ? new PushSubscriptionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ReactionCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ReactionCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ReactionCreate mutation and return a ReactionPayload
   *
   * @param input - required input to pass to reactionCreate
   * @returns parsed response from ReactionCreateMutation
   */
  public async fetch(input: L.ReactionCreateInput): Fetch<ReactionPayload> {
    return this._request<L.ReactionCreateMutation, L.ReactionCreateMutationVariables>(L.ReactionCreateDocument, {
      input,
    }).then(response => {
      const data = response?.reactionCreate;
      return data ? new ReactionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ReactionDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class ReactionDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ReactionDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to reactionDelete
   * @returns parsed response from ReactionDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.ReactionDeleteMutation, L.ReactionDeleteMutationVariables>(L.ReactionDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.reactionDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable RefreshGoogleSheetsData Mutation
 *
 * @param request - function to call the graphql client
 */
export class RefreshGoogleSheetsDataMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the RefreshGoogleSheetsData mutation and return a IntegrationPayload
   *
   * @param id - required id to pass to refreshGoogleSheetsData
   * @returns parsed response from RefreshGoogleSheetsDataMutation
   */
  public async fetch(id: string): Fetch<IntegrationPayload> {
    return this._request<L.RefreshGoogleSheetsDataMutation, L.RefreshGoogleSheetsDataMutationVariables>(
      L.RefreshGoogleSheetsDataDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.refreshGoogleSheetsData;
      return data ? new IntegrationPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ResentOrganizationInvite Mutation
 *
 * @param request - function to call the graphql client
 */
export class ResentOrganizationInviteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ResentOrganizationInvite mutation and return a ArchivePayload
   *
   * @param id - required id to pass to resentOrganizationInvite
   * @returns parsed response from ResentOrganizationInviteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.ResentOrganizationInviteMutation, L.ResentOrganizationInviteMutationVariables>(
      L.ResentOrganizationInviteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.resentOrganizationInvite;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SamlTokenUserAccountAuth Mutation
 *
 * @param request - function to call the graphql client
 */
export class SamlTokenUserAccountAuthMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SamlTokenUserAccountAuth mutation and return a AuthResolverResponse
   *
   * @param input - required input to pass to samlTokenUserAccountAuth
   * @returns parsed response from SamlTokenUserAccountAuthMutation
   */
  public async fetch(input: L.TokenUserAccountAuthInput): Fetch<AuthResolverResponse> {
    return this._request<L.SamlTokenUserAccountAuthMutation, L.SamlTokenUserAccountAuthMutationVariables>(
      L.SamlTokenUserAccountAuthDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.samlTokenUserAccountAuth;
      return data ? new AuthResolverResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SubscriptionArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class SubscriptionArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SubscriptionArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to subscriptionArchive
   * @returns parsed response from SubscriptionArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.SubscriptionArchiveMutation, L.SubscriptionArchiveMutationVariables>(
      L.SubscriptionArchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.subscriptionArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SubscriptionSessionCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class SubscriptionSessionCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SubscriptionSessionCreate mutation and return a SubscriptionSessionPayload
   *
   * @param plan - required plan to pass to subscriptionSessionCreate
   * @returns parsed response from SubscriptionSessionCreateMutation
   */
  public async fetch(plan: string): Fetch<SubscriptionSessionPayload> {
    return this._request<L.SubscriptionSessionCreateMutation, L.SubscriptionSessionCreateMutationVariables>(
      L.SubscriptionSessionCreateDocument,
      {
        plan,
      }
    ).then(response => {
      const data = response?.subscriptionSessionCreate;
      return data ? new SubscriptionSessionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SubscriptionUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class SubscriptionUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SubscriptionUpdate mutation and return a SubscriptionPayload
   *
   * @param id - required id to pass to subscriptionUpdate
   * @param input - required input to pass to subscriptionUpdate
   * @returns parsed response from SubscriptionUpdateMutation
   */
  public async fetch(id: string, input: L.SubscriptionUpdateInput): Fetch<SubscriptionPayload> {
    return this._request<L.SubscriptionUpdateMutation, L.SubscriptionUpdateMutationVariables>(
      L.SubscriptionUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.subscriptionUpdate;
      return data ? new SubscriptionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SubscriptionUpdateSessionCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class SubscriptionUpdateSessionCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SubscriptionUpdateSessionCreate mutation and return a SubscriptionSessionPayload
   *
   * @returns parsed response from SubscriptionUpdateSessionCreateMutation
   */
  public async fetch(): Fetch<SubscriptionSessionPayload> {
    return this._request<L.SubscriptionUpdateSessionCreateMutation, L.SubscriptionUpdateSessionCreateMutationVariables>(
      L.SubscriptionUpdateSessionCreateDocument,
      {}
    ).then(response => {
      const data = response?.subscriptionUpdateSessionCreate;
      return data ? new SubscriptionSessionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable SubscriptionUpgrade Mutation
 *
 * @param request - function to call the graphql client
 */
export class SubscriptionUpgradeMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the SubscriptionUpgrade mutation and return a SubscriptionPayload
   *
   * @param id - required id to pass to subscriptionUpgrade
   * @param type - required type to pass to subscriptionUpgrade
   * @returns parsed response from SubscriptionUpgradeMutation
   */
  public async fetch(id: string, type: string): Fetch<SubscriptionPayload> {
    return this._request<L.SubscriptionUpgradeMutation, L.SubscriptionUpgradeMutationVariables>(
      L.SubscriptionUpgradeDocument,
      {
        id,
        type,
      }
    ).then(response => {
      const data = response?.subscriptionUpgrade;
      return data ? new SubscriptionPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class TeamArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to teamArchive
   * @returns parsed response from TeamArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.TeamArchiveMutation, L.TeamArchiveMutationVariables>(L.TeamArchiveDocument, {
      id,
    }).then(response => {
      const data = response?.teamArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class TeamCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamCreate mutation and return a TeamPayload
   *
   * @param input - required input to pass to teamCreate
   * @param variables - variables without 'input' to pass into the TeamCreateMutation
   * @returns parsed response from TeamCreateMutation
   */
  public async fetch(
    input: L.TeamCreateInput,
    variables?: Omit<L.TeamCreateMutationVariables, "input">
  ): Fetch<TeamPayload> {
    return this._request<L.TeamCreateMutation, L.TeamCreateMutationVariables>(L.TeamCreateDocument, {
      input,
      ...variables,
    }).then(response => {
      const data = response?.teamCreate;
      return data ? new TeamPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class TeamDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to teamDelete
   * @returns parsed response from TeamDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.TeamDeleteMutation, L.TeamDeleteMutationVariables>(L.TeamDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.teamDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamMembershipCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class TeamMembershipCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamMembershipCreate mutation and return a TeamMembershipPayload
   *
   * @param input - required input to pass to teamMembershipCreate
   * @returns parsed response from TeamMembershipCreateMutation
   */
  public async fetch(input: L.TeamMembershipCreateInput): Fetch<TeamMembershipPayload> {
    return this._request<L.TeamMembershipCreateMutation, L.TeamMembershipCreateMutationVariables>(
      L.TeamMembershipCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.teamMembershipCreate;
      return data ? new TeamMembershipPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamMembershipDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class TeamMembershipDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamMembershipDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to teamMembershipDelete
   * @returns parsed response from TeamMembershipDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.TeamMembershipDeleteMutation, L.TeamMembershipDeleteMutationVariables>(
      L.TeamMembershipDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.teamMembershipDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TeamUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class TeamUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TeamUpdate mutation and return a TeamPayload
   *
   * @param id - required id to pass to teamUpdate
   * @param input - required input to pass to teamUpdate
   * @returns parsed response from TeamUpdateMutation
   */
  public async fetch(id: string, input: L.TeamUpdateInput): Fetch<TeamPayload> {
    return this._request<L.TeamUpdateMutation, L.TeamUpdateMutationVariables>(L.TeamUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.teamUpdate;
      return data ? new TeamPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TemplateCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class TemplateCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TemplateCreate mutation and return a TemplatePayload
   *
   * @param input - required input to pass to templateCreate
   * @returns parsed response from TemplateCreateMutation
   */
  public async fetch(input: L.TemplateCreateInput): Fetch<TemplatePayload> {
    return this._request<L.TemplateCreateMutation, L.TemplateCreateMutationVariables>(L.TemplateCreateDocument, {
      input,
    }).then(response => {
      const data = response?.templateCreate;
      return data ? new TemplatePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TemplateDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class TemplateDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TemplateDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to templateDelete
   * @returns parsed response from TemplateDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.TemplateDeleteMutation, L.TemplateDeleteMutationVariables>(L.TemplateDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.templateDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable TemplateUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class TemplateUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the TemplateUpdate mutation and return a TemplatePayload
   *
   * @param id - required id to pass to templateUpdate
   * @param input - required input to pass to templateUpdate
   * @returns parsed response from TemplateUpdateMutation
   */
  public async fetch(id: string, input: L.TemplateUpdateInput): Fetch<TemplatePayload> {
    return this._request<L.TemplateUpdateMutation, L.TemplateUpdateMutationVariables>(L.TemplateUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.templateUpdate;
      return data ? new TemplatePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserDemoteAdmin Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserDemoteAdminMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserDemoteAdmin mutation and return a UserAdminPayload
   *
   * @param id - required id to pass to userDemoteAdmin
   * @returns parsed response from UserDemoteAdminMutation
   */
  public async fetch(id: string): Fetch<UserAdminPayload> {
    return this._request<L.UserDemoteAdminMutation, L.UserDemoteAdminMutationVariables>(L.UserDemoteAdminDocument, {
      id,
    }).then(response => {
      const data = response?.userDemoteAdmin;
      return data ? new UserAdminPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserFlagUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserFlagUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserFlagUpdate mutation and return a UserSettingsFlagPayload
   *
   * @param flag - required flag to pass to userFlagUpdate
   * @param operation - required operation to pass to userFlagUpdate
   * @returns parsed response from UserFlagUpdateMutation
   */
  public async fetch(flag: L.UserFlagType, operation: L.UserFlagUpdateOperation): Fetch<UserSettingsFlagPayload> {
    return this._request<L.UserFlagUpdateMutation, L.UserFlagUpdateMutationVariables>(L.UserFlagUpdateDocument, {
      flag,
      operation,
    }).then(response => {
      const data = response?.userFlagUpdate;
      return data ? new UserSettingsFlagPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserPromoteAdmin Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserPromoteAdminMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserPromoteAdmin mutation and return a UserAdminPayload
   *
   * @param id - required id to pass to userPromoteAdmin
   * @returns parsed response from UserPromoteAdminMutation
   */
  public async fetch(id: string): Fetch<UserAdminPayload> {
    return this._request<L.UserPromoteAdminMutation, L.UserPromoteAdminMutationVariables>(L.UserPromoteAdminDocument, {
      id,
    }).then(response => {
      const data = response?.userPromoteAdmin;
      return data ? new UserAdminPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserSettingsFlagIncrement Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserSettingsFlagIncrementMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserSettingsFlagIncrement mutation and return a UserSettingsFlagPayload
   *
   * @param flag - required flag to pass to userSettingsFlagIncrement
   * @returns parsed response from UserSettingsFlagIncrementMutation
   */
  public async fetch(flag: string): Fetch<UserSettingsFlagPayload> {
    return this._request<L.UserSettingsFlagIncrementMutation, L.UserSettingsFlagIncrementMutationVariables>(
      L.UserSettingsFlagIncrementDocument,
      {
        flag,
      }
    ).then(response => {
      const data = response?.userSettingsFlagIncrement;
      return data ? new UserSettingsFlagPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserSettingsFlagsReset Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserSettingsFlagsResetMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserSettingsFlagsReset mutation and return a UserSettingsFlagsResetPayload
   *
   * @returns parsed response from UserSettingsFlagsResetMutation
   */
  public async fetch(): Fetch<UserSettingsFlagsResetPayload> {
    return this._request<L.UserSettingsFlagsResetMutation, L.UserSettingsFlagsResetMutationVariables>(
      L.UserSettingsFlagsResetDocument,
      {}
    ).then(response => {
      const data = response?.userSettingsFlagsReset;
      return data ? new UserSettingsFlagsResetPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserSettingsUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserSettingsUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserSettingsUpdate mutation and return a UserSettingsPayload
   *
   * @param id - required id to pass to userSettingsUpdate
   * @param input - required input to pass to userSettingsUpdate
   * @returns parsed response from UserSettingsUpdateMutation
   */
  public async fetch(id: string, input: L.UserSettingsUpdateInput): Fetch<UserSettingsPayload> {
    return this._request<L.UserSettingsUpdateMutation, L.UserSettingsUpdateMutationVariables>(
      L.UserSettingsUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.userSettingsUpdate;
      return data ? new UserSettingsPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserSubscribeToNewsletter Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserSubscribeToNewsletterMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserSubscribeToNewsletter mutation and return a UserSubscribeToNewsletterPayload
   *
   * @returns parsed response from UserSubscribeToNewsletterMutation
   */
  public async fetch(): Fetch<UserSubscribeToNewsletterPayload> {
    return this._request<L.UserSubscribeToNewsletterMutation, L.UserSubscribeToNewsletterMutationVariables>(
      L.UserSubscribeToNewsletterDocument,
      {}
    ).then(response => {
      const data = response?.userSubscribeToNewsletter;
      return data ? new UserSubscribeToNewsletterPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserSuspend Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserSuspendMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserSuspend mutation and return a UserAdminPayload
   *
   * @param id - required id to pass to userSuspend
   * @returns parsed response from UserSuspendMutation
   */
  public async fetch(id: string): Fetch<UserAdminPayload> {
    return this._request<L.UserSuspendMutation, L.UserSuspendMutationVariables>(L.UserSuspendDocument, {
      id,
    }).then(response => {
      const data = response?.userSuspend;
      return data ? new UserAdminPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserUnsuspend Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserUnsuspendMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserUnsuspend mutation and return a UserAdminPayload
   *
   * @param id - required id to pass to userUnsuspend
   * @returns parsed response from UserUnsuspendMutation
   */
  public async fetch(id: string): Fetch<UserAdminPayload> {
    return this._request<L.UserUnsuspendMutation, L.UserUnsuspendMutationVariables>(L.UserUnsuspendDocument, {
      id,
    }).then(response => {
      const data = response?.userUnsuspend;
      return data ? new UserAdminPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable UserUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class UserUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the UserUpdate mutation and return a UserPayload
   *
   * @param id - required id to pass to userUpdate
   * @param input - required input to pass to userUpdate
   * @returns parsed response from UserUpdateMutation
   */
  public async fetch(id: string, input: L.UpdateUserInput): Fetch<UserPayload> {
    return this._request<L.UserUpdateMutation, L.UserUpdateMutationVariables>(L.UserUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.userUpdate;
      return data ? new UserPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ViewPreferencesCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ViewPreferencesCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ViewPreferencesCreate mutation and return a ViewPreferencesPayload
   *
   * @param input - required input to pass to viewPreferencesCreate
   * @returns parsed response from ViewPreferencesCreateMutation
   */
  public async fetch(input: L.ViewPreferencesCreateInput): Fetch<ViewPreferencesPayload> {
    return this._request<L.ViewPreferencesCreateMutation, L.ViewPreferencesCreateMutationVariables>(
      L.ViewPreferencesCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.viewPreferencesCreate;
      return data ? new ViewPreferencesPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ViewPreferencesDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class ViewPreferencesDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ViewPreferencesDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to viewPreferencesDelete
   * @returns parsed response from ViewPreferencesDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.ViewPreferencesDeleteMutation, L.ViewPreferencesDeleteMutationVariables>(
      L.ViewPreferencesDeleteDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.viewPreferencesDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable ViewPreferencesUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class ViewPreferencesUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the ViewPreferencesUpdate mutation and return a ViewPreferencesPayload
   *
   * @param id - required id to pass to viewPreferencesUpdate
   * @param input - required input to pass to viewPreferencesUpdate
   * @returns parsed response from ViewPreferencesUpdateMutation
   */
  public async fetch(id: string, input: L.ViewPreferencesUpdateInput): Fetch<ViewPreferencesPayload> {
    return this._request<L.ViewPreferencesUpdateMutation, L.ViewPreferencesUpdateMutationVariables>(
      L.ViewPreferencesUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.viewPreferencesUpdate;
      return data ? new ViewPreferencesPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WebhookCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class WebhookCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WebhookCreate mutation and return a WebhookPayload
   *
   * @param input - required input to pass to webhookCreate
   * @returns parsed response from WebhookCreateMutation
   */
  public async fetch(input: L.WebhookCreateInput): Fetch<WebhookPayload> {
    return this._request<L.WebhookCreateMutation, L.WebhookCreateMutationVariables>(L.WebhookCreateDocument, {
      input,
    }).then(response => {
      const data = response?.webhookCreate;
      return data ? new WebhookPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WebhookDelete Mutation
 *
 * @param request - function to call the graphql client
 */
export class WebhookDeleteMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WebhookDelete mutation and return a ArchivePayload
   *
   * @param id - required id to pass to webhookDelete
   * @returns parsed response from WebhookDeleteMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.WebhookDeleteMutation, L.WebhookDeleteMutationVariables>(L.WebhookDeleteDocument, {
      id,
    }).then(response => {
      const data = response?.webhookDelete;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WebhookUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class WebhookUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WebhookUpdate mutation and return a WebhookPayload
   *
   * @param id - required id to pass to webhookUpdate
   * @param input - required input to pass to webhookUpdate
   * @returns parsed response from WebhookUpdateMutation
   */
  public async fetch(id: string, input: L.WebhookUpdateInput): Fetch<WebhookPayload> {
    return this._request<L.WebhookUpdateMutation, L.WebhookUpdateMutationVariables>(L.WebhookUpdateDocument, {
      id,
      input,
    }).then(response => {
      const data = response?.webhookUpdate;
      return data ? new WebhookPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WorkflowStateArchive Mutation
 *
 * @param request - function to call the graphql client
 */
export class WorkflowStateArchiveMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WorkflowStateArchive mutation and return a ArchivePayload
   *
   * @param id - required id to pass to workflowStateArchive
   * @returns parsed response from WorkflowStateArchiveMutation
   */
  public async fetch(id: string): Fetch<ArchivePayload> {
    return this._request<L.WorkflowStateArchiveMutation, L.WorkflowStateArchiveMutationVariables>(
      L.WorkflowStateArchiveDocument,
      {
        id,
      }
    ).then(response => {
      const data = response?.workflowStateArchive;
      return data ? new ArchivePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WorkflowStateCreate Mutation
 *
 * @param request - function to call the graphql client
 */
export class WorkflowStateCreateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WorkflowStateCreate mutation and return a WorkflowStatePayload
   *
   * @param input - required input to pass to workflowStateCreate
   * @returns parsed response from WorkflowStateCreateMutation
   */
  public async fetch(input: L.WorkflowStateCreateInput): Fetch<WorkflowStatePayload> {
    return this._request<L.WorkflowStateCreateMutation, L.WorkflowStateCreateMutationVariables>(
      L.WorkflowStateCreateDocument,
      {
        input,
      }
    ).then(response => {
      const data = response?.workflowStateCreate;
      return data ? new WorkflowStatePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable WorkflowStateUpdate Mutation
 *
 * @param request - function to call the graphql client
 */
export class WorkflowStateUpdateMutation extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the WorkflowStateUpdate mutation and return a WorkflowStatePayload
   *
   * @param id - required id to pass to workflowStateUpdate
   * @param input - required input to pass to workflowStateUpdate
   * @returns parsed response from WorkflowStateUpdateMutation
   */
  public async fetch(id: string, input: L.WorkflowStateUpdateInput): Fetch<WorkflowStatePayload> {
    return this._request<L.WorkflowStateUpdateMutation, L.WorkflowStateUpdateMutationVariables>(
      L.WorkflowStateUpdateDocument,
      {
        id,
        input,
      }
    ).then(response => {
      const data = response?.workflowStateUpdate;
      return data ? new WorkflowStatePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable BillingDetails_PaymentMethod Query
 *
 * @param request - function to call the graphql client
 */
export class BillingDetails_PaymentMethodQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the BillingDetails_PaymentMethod query and return a Card
   *
   * @returns parsed response from BillingDetails_PaymentMethodQuery
   */
  public async fetch(): Fetch<Card> {
    return this._request<L.BillingDetails_PaymentMethodQuery, L.BillingDetails_PaymentMethodQueryVariables>(
      L.BillingDetails_PaymentMethodDocument,
      {}
    ).then(response => {
      const data = response?.billingDetails?.paymentMethod;
      return data ? new Card(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable CollaborativeDocumentJoin_Steps Query
 *
 * @param request - function to call the graphql client
 * @param clientId - required clientId to pass to collaborativeDocumentJoin
 * @param issueId - required issueId to pass to collaborativeDocumentJoin
 * @param version - required version to pass to collaborativeDocumentJoin
 */
export class CollaborativeDocumentJoin_StepsQuery extends LinearRequest {
  private _clientId: string;
  private _issueId: string;
  private _version: number;

  public constructor(request: Request, clientId: string, issueId: string, version: number) {
    super(request);
    this._clientId = clientId;
    this._issueId = issueId;
    this._version = version;
  }

  /**
   * Call the CollaborativeDocumentJoin_Steps query and return a StepsResponse
   *
   * @returns parsed response from CollaborativeDocumentJoin_StepsQuery
   */
  public async fetch(): Fetch<StepsResponse> {
    return this._request<L.CollaborativeDocumentJoin_StepsQuery, L.CollaborativeDocumentJoin_StepsQueryVariables>(
      L.CollaborativeDocumentJoin_StepsDocument,
      {
        clientId: this._clientId,
        issueId: this._issueId,
        version: this._version,
      }
    ).then(response => {
      const data = response?.collaborativeDocumentJoin?.steps;
      return data ? new StepsResponse(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Cycle_Issues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to cycle
 */
export class Cycle_IssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Cycle_Issues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the Cycle_IssuesQuery
   * @returns parsed response from Cycle_IssuesQuery
   */
  public async fetch(variables?: Omit<L.Cycle_IssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.Cycle_IssuesQuery, L.Cycle_IssuesQueryVariables>(L.Cycle_IssuesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.cycle?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Cycle_UncompletedIssuesUponClose Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to cycle
 */
export class Cycle_UncompletedIssuesUponCloseQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Cycle_UncompletedIssuesUponClose query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the Cycle_UncompletedIssuesUponCloseQuery
   * @returns parsed response from Cycle_UncompletedIssuesUponCloseQuery
   */
  public async fetch(variables?: Omit<L.Cycle_UncompletedIssuesUponCloseQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.Cycle_UncompletedIssuesUponCloseQuery, L.Cycle_UncompletedIssuesUponCloseQueryVariables>(
      L.Cycle_UncompletedIssuesUponCloseDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.cycle?.uncompletedIssuesUponClose;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable FigmaEmbedInfo_FigmaEmbed Query
 *
 * @param request - function to call the graphql client
 * @param fileId - required fileId to pass to figmaEmbedInfo
 */
export class FigmaEmbedInfo_FigmaEmbedQuery extends LinearRequest {
  private _fileId: string;

  public constructor(request: Request, fileId: string) {
    super(request);
    this._fileId = fileId;
  }

  /**
   * Call the FigmaEmbedInfo_FigmaEmbed query and return a FigmaEmbed
   *
   * @param variables - variables without 'fileId' to pass into the FigmaEmbedInfo_FigmaEmbedQuery
   * @returns parsed response from FigmaEmbedInfo_FigmaEmbedQuery
   */
  public async fetch(variables?: Omit<L.FigmaEmbedInfo_FigmaEmbedQueryVariables, "fileId">): Fetch<FigmaEmbed> {
    return this._request<L.FigmaEmbedInfo_FigmaEmbedQuery, L.FigmaEmbedInfo_FigmaEmbedQueryVariables>(
      L.FigmaEmbedInfo_FigmaEmbedDocument,
      {
        fileId: this._fileId,
        ...variables,
      }
    ).then(response => {
      const data = response?.figmaEmbedInfo?.figmaEmbed;
      return data ? new FigmaEmbed(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource_Data Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to integrationResource
 */
export class IntegrationResource_DataQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IntegrationResource_Data query and return a IntegrationResourceData
   *
   * @returns parsed response from IntegrationResource_DataQuery
   */
  public async fetch(): Fetch<IntegrationResourceData> {
    return this._request<L.IntegrationResource_DataQuery, L.IntegrationResource_DataQueryVariables>(
      L.IntegrationResource_DataDocument,
      {
        id: this._id,
      }
    ).then(response => {
      const data = response?.integrationResource?.data;
      return data ? new IntegrationResourceData(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource_PullRequest Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to integrationResource
 */
export class IntegrationResource_PullRequestQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IntegrationResource_PullRequest query and return a PullRequestPayload
   *
   * @returns parsed response from IntegrationResource_PullRequestQuery
   */
  public async fetch(): Fetch<PullRequestPayload> {
    return this._request<L.IntegrationResource_PullRequestQuery, L.IntegrationResource_PullRequestQueryVariables>(
      L.IntegrationResource_PullRequestDocument,
      {
        id: this._id,
      }
    ).then(response => {
      const data = response?.integrationResource?.pullRequest;
      return data ? new PullRequestPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource_Data_GithubCommit Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to integrationResource_data
 */
export class IntegrationResource_Data_GithubCommitQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IntegrationResource_Data_GithubCommit query and return a CommitPayload
   *
   * @returns parsed response from IntegrationResource_Data_GithubCommitQuery
   */
  public async fetch(): Fetch<CommitPayload> {
    return this._request<
      L.IntegrationResource_Data_GithubCommitQuery,
      L.IntegrationResource_Data_GithubCommitQueryVariables
    >(L.IntegrationResource_Data_GithubCommitDocument, {
      id: this._id,
    }).then(response => {
      const data = response?.integrationResource?.data?.githubCommit;
      return data ? new CommitPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource_Data_GithubPullRequest Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to integrationResource_data
 */
export class IntegrationResource_Data_GithubPullRequestQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IntegrationResource_Data_GithubPullRequest query and return a PullRequestPayload
   *
   * @returns parsed response from IntegrationResource_Data_GithubPullRequestQuery
   */
  public async fetch(): Fetch<PullRequestPayload> {
    return this._request<
      L.IntegrationResource_Data_GithubPullRequestQuery,
      L.IntegrationResource_Data_GithubPullRequestQueryVariables
    >(L.IntegrationResource_Data_GithubPullRequestDocument, {
      id: this._id,
    }).then(response => {
      const data = response?.integrationResource?.data?.githubPullRequest;
      return data ? new PullRequestPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource_Data_GitlabMergeRequest Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to integrationResource_data
 */
export class IntegrationResource_Data_GitlabMergeRequestQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IntegrationResource_Data_GitlabMergeRequest query and return a PullRequestPayload
   *
   * @returns parsed response from IntegrationResource_Data_GitlabMergeRequestQuery
   */
  public async fetch(): Fetch<PullRequestPayload> {
    return this._request<
      L.IntegrationResource_Data_GitlabMergeRequestQuery,
      L.IntegrationResource_Data_GitlabMergeRequestQueryVariables
    >(L.IntegrationResource_Data_GitlabMergeRequestDocument, {
      id: this._id,
    }).then(response => {
      const data = response?.integrationResource?.data?.gitlabMergeRequest;
      return data ? new PullRequestPayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable IntegrationResource_Data_SentryIssue Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to integrationResource_data
 */
export class IntegrationResource_Data_SentryIssueQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IntegrationResource_Data_SentryIssue query and return a SentryIssuePayload
   *
   * @returns parsed response from IntegrationResource_Data_SentryIssueQuery
   */
  public async fetch(): Fetch<SentryIssuePayload> {
    return this._request<
      L.IntegrationResource_Data_SentryIssueQuery,
      L.IntegrationResource_Data_SentryIssueQueryVariables
    >(L.IntegrationResource_Data_SentryIssueDocument, {
      id: this._id,
    }).then(response => {
      const data = response?.integrationResource?.data?.sentryIssue;
      return data ? new SentryIssuePayload(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable InviteInfo_InviteData Query
 *
 * @param request - function to call the graphql client
 * @param userHash - required userHash to pass to inviteInfo
 */
export class InviteInfo_InviteDataQuery extends LinearRequest {
  private _userHash: string;

  public constructor(request: Request, userHash: string) {
    super(request);
    this._userHash = userHash;
  }

  /**
   * Call the InviteInfo_InviteData query and return a InviteData
   *
   * @param variables - variables without 'userHash' to pass into the InviteInfo_InviteDataQuery
   * @returns parsed response from InviteInfo_InviteDataQuery
   */
  public async fetch(variables?: Omit<L.InviteInfo_InviteDataQueryVariables, "userHash">): Fetch<InviteData> {
    return this._request<L.InviteInfo_InviteDataQuery, L.InviteInfo_InviteDataQueryVariables>(
      L.InviteInfo_InviteDataDocument,
      {
        userHash: this._userHash,
        ...variables,
      }
    ).then(response => {
      const data = response?.inviteInfo?.inviteData;
      return data ? new InviteData(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Issue_Children Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_ChildrenQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_Children query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_ChildrenQuery
   * @returns parsed response from Issue_ChildrenQuery
   */
  public async fetch(variables?: Omit<L.Issue_ChildrenQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.Issue_ChildrenQuery, L.Issue_ChildrenQueryVariables>(L.Issue_ChildrenDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issue?.children;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_Comments Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_CommentsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_Comments query and return a CommentConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_CommentsQuery
   * @returns parsed response from Issue_CommentsQuery
   */
  public async fetch(variables?: Omit<L.Issue_CommentsQueryVariables, "id">): Fetch<CommentConnection> {
    return this._request<L.Issue_CommentsQuery, L.Issue_CommentsQueryVariables>(L.Issue_CommentsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issue?.comments;
      return data
        ? new CommentConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_History Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_HistoryQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_History query and return a IssueHistoryConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_HistoryQuery
   * @returns parsed response from Issue_HistoryQuery
   */
  public async fetch(variables?: Omit<L.Issue_HistoryQueryVariables, "id">): Fetch<IssueHistoryConnection> {
    return this._request<L.Issue_HistoryQuery, L.Issue_HistoryQueryVariables>(L.Issue_HistoryDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issue?.history;
      return data
        ? new IssueHistoryConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_IntegrationResources Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_IntegrationResourcesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_IntegrationResources query and return a IntegrationResourceConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_IntegrationResourcesQuery
   * @returns parsed response from Issue_IntegrationResourcesQuery
   */
  public async fetch(
    variables?: Omit<L.Issue_IntegrationResourcesQueryVariables, "id">
  ): Fetch<IntegrationResourceConnection> {
    return this._request<L.Issue_IntegrationResourcesQuery, L.Issue_IntegrationResourcesQueryVariables>(
      L.Issue_IntegrationResourcesDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.issue?.integrationResources;
      return data
        ? new IntegrationResourceConnection(
            this._request,
            pagination => this.fetch({ ...variables, ...pagination }),
            data
          )
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_InverseRelations Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_InverseRelationsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_InverseRelations query and return a IssueRelationConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_InverseRelationsQuery
   * @returns parsed response from Issue_InverseRelationsQuery
   */
  public async fetch(variables?: Omit<L.Issue_InverseRelationsQueryVariables, "id">): Fetch<IssueRelationConnection> {
    return this._request<L.Issue_InverseRelationsQuery, L.Issue_InverseRelationsQueryVariables>(
      L.Issue_InverseRelationsDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.issue?.inverseRelations;
      return data
        ? new IssueRelationConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_Labels Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_LabelsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_Labels query and return a IssueLabelConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_LabelsQuery
   * @returns parsed response from Issue_LabelsQuery
   */
  public async fetch(variables?: Omit<L.Issue_LabelsQueryVariables, "id">): Fetch<IssueLabelConnection> {
    return this._request<L.Issue_LabelsQuery, L.Issue_LabelsQueryVariables>(L.Issue_LabelsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issue?.labels;
      return data
        ? new IssueLabelConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_Relations Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_RelationsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_Relations query and return a IssueRelationConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_RelationsQuery
   * @returns parsed response from Issue_RelationsQuery
   */
  public async fetch(variables?: Omit<L.Issue_RelationsQueryVariables, "id">): Fetch<IssueRelationConnection> {
    return this._request<L.Issue_RelationsQuery, L.Issue_RelationsQueryVariables>(L.Issue_RelationsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issue?.relations;
      return data
        ? new IssueRelationConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Issue_Subscribers Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issue
 */
export class Issue_SubscribersQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Issue_Subscribers query and return a UserConnection
   *
   * @param variables - variables without 'id' to pass into the Issue_SubscribersQuery
   * @returns parsed response from Issue_SubscribersQuery
   */
  public async fetch(variables?: Omit<L.Issue_SubscribersQueryVariables, "id">): Fetch<UserConnection> {
    return this._request<L.Issue_SubscribersQuery, L.Issue_SubscribersQueryVariables>(L.Issue_SubscribersDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issue?.subscribers;
      return data
        ? new UserConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable IssueLabel_Issues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to issueLabel
 */
export class IssueLabel_IssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the IssueLabel_Issues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the IssueLabel_IssuesQuery
   * @returns parsed response from IssueLabel_IssuesQuery
   */
  public async fetch(variables?: Omit<L.IssueLabel_IssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.IssueLabel_IssuesQuery, L.IssueLabel_IssuesQueryVariables>(L.IssueLabel_IssuesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.issueLabel?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Milestone_Projects Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to milestone
 */
export class Milestone_ProjectsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Milestone_Projects query and return a ProjectConnection
   *
   * @param variables - variables without 'id' to pass into the Milestone_ProjectsQuery
   * @returns parsed response from Milestone_ProjectsQuery
   */
  public async fetch(variables?: Omit<L.Milestone_ProjectsQueryVariables, "id">): Fetch<ProjectConnection> {
    return this._request<L.Milestone_ProjectsQuery, L.Milestone_ProjectsQueryVariables>(L.Milestone_ProjectsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.milestone?.projects;
      return data
        ? new ProjectConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Organization_Integrations Query
 *
 * @param request - function to call the graphql client
 */
export class Organization_IntegrationsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Organization_Integrations query and return a IntegrationConnection
   *
   * @param variables - variables to pass into the Organization_IntegrationsQuery
   * @returns parsed response from Organization_IntegrationsQuery
   */
  public async fetch(variables?: L.Organization_IntegrationsQueryVariables): Fetch<IntegrationConnection> {
    return this._request<L.Organization_IntegrationsQuery, L.Organization_IntegrationsQueryVariables>(
      L.Organization_IntegrationsDocument,
      variables
    ).then(response => {
      const data = response?.organization?.integrations;
      return data
        ? new IntegrationConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Organization_Milestones Query
 *
 * @param request - function to call the graphql client
 */
export class Organization_MilestonesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Organization_Milestones query and return a MilestoneConnection
   *
   * @param variables - variables to pass into the Organization_MilestonesQuery
   * @returns parsed response from Organization_MilestonesQuery
   */
  public async fetch(variables?: L.Organization_MilestonesQueryVariables): Fetch<MilestoneConnection> {
    return this._request<L.Organization_MilestonesQuery, L.Organization_MilestonesQueryVariables>(
      L.Organization_MilestonesDocument,
      variables
    ).then(response => {
      const data = response?.organization?.milestones;
      return data
        ? new MilestoneConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Organization_Teams Query
 *
 * @param request - function to call the graphql client
 */
export class Organization_TeamsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Organization_Teams query and return a TeamConnection
   *
   * @param variables - variables to pass into the Organization_TeamsQuery
   * @returns parsed response from Organization_TeamsQuery
   */
  public async fetch(variables?: L.Organization_TeamsQueryVariables): Fetch<TeamConnection> {
    return this._request<L.Organization_TeamsQuery, L.Organization_TeamsQueryVariables>(
      L.Organization_TeamsDocument,
      variables
    ).then(response => {
      const data = response?.organization?.teams;
      return data
        ? new TeamConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Organization_Users Query
 *
 * @param request - function to call the graphql client
 */
export class Organization_UsersQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Organization_Users query and return a UserConnection
   *
   * @param variables - variables to pass into the Organization_UsersQuery
   * @returns parsed response from Organization_UsersQuery
   */
  public async fetch(variables?: L.Organization_UsersQueryVariables): Fetch<UserConnection> {
    return this._request<L.Organization_UsersQuery, L.Organization_UsersQueryVariables>(
      L.Organization_UsersDocument,
      variables
    ).then(response => {
      const data = response?.organization?.users;
      return data
        ? new UserConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable OrganizationInvite_Issues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to organizationInvite
 */
export class OrganizationInvite_IssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the OrganizationInvite_Issues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the OrganizationInvite_IssuesQuery
   * @returns parsed response from OrganizationInvite_IssuesQuery
   */
  public async fetch(variables?: Omit<L.OrganizationInvite_IssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.OrganizationInvite_IssuesQuery, L.OrganizationInvite_IssuesQueryVariables>(
      L.OrganizationInvite_IssuesDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.organizationInvite?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Project_Issues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to project
 */
export class Project_IssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Project_Issues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the Project_IssuesQuery
   * @returns parsed response from Project_IssuesQuery
   */
  public async fetch(variables?: Omit<L.Project_IssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.Project_IssuesQuery, L.Project_IssuesQueryVariables>(L.Project_IssuesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.project?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Project_Links Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to project
 */
export class Project_LinksQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Project_Links query and return a ProjectLinkConnection
   *
   * @param variables - variables without 'id' to pass into the Project_LinksQuery
   * @returns parsed response from Project_LinksQuery
   */
  public async fetch(variables?: Omit<L.Project_LinksQueryVariables, "id">): Fetch<ProjectLinkConnection> {
    return this._request<L.Project_LinksQuery, L.Project_LinksQueryVariables>(L.Project_LinksDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.project?.links;
      return data
        ? new ProjectLinkConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Project_Members Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to project
 */
export class Project_MembersQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Project_Members query and return a UserConnection
   *
   * @param variables - variables without 'id' to pass into the Project_MembersQuery
   * @returns parsed response from Project_MembersQuery
   */
  public async fetch(variables?: Omit<L.Project_MembersQueryVariables, "id">): Fetch<UserConnection> {
    return this._request<L.Project_MembersQuery, L.Project_MembersQueryVariables>(L.Project_MembersDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.project?.members;
      return data
        ? new UserConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Project_Teams Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to project
 */
export class Project_TeamsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Project_Teams query and return a TeamConnection
   *
   * @param variables - variables without 'id' to pass into the Project_TeamsQuery
   * @returns parsed response from Project_TeamsQuery
   */
  public async fetch(variables?: Omit<L.Project_TeamsQueryVariables, "id">): Fetch<TeamConnection> {
    return this._request<L.Project_TeamsQuery, L.Project_TeamsQueryVariables>(L.Project_TeamsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.project?.teams;
      return data
        ? new TeamConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_Cycles Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_CyclesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Cycles query and return a CycleConnection
   *
   * @param variables - variables without 'id' to pass into the Team_CyclesQuery
   * @returns parsed response from Team_CyclesQuery
   */
  public async fetch(variables?: Omit<L.Team_CyclesQueryVariables, "id">): Fetch<CycleConnection> {
    return this._request<L.Team_CyclesQuery, L.Team_CyclesQueryVariables>(L.Team_CyclesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.cycles;
      return data
        ? new CycleConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_Issues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_IssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Issues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the Team_IssuesQuery
   * @returns parsed response from Team_IssuesQuery
   */
  public async fetch(variables?: Omit<L.Team_IssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.Team_IssuesQuery, L.Team_IssuesQueryVariables>(L.Team_IssuesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_Labels Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_LabelsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Labels query and return a IssueLabelConnection
   *
   * @param variables - variables without 'id' to pass into the Team_LabelsQuery
   * @returns parsed response from Team_LabelsQuery
   */
  public async fetch(variables?: Omit<L.Team_LabelsQueryVariables, "id">): Fetch<IssueLabelConnection> {
    return this._request<L.Team_LabelsQuery, L.Team_LabelsQueryVariables>(L.Team_LabelsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.labels;
      return data
        ? new IssueLabelConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_Memberships Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_MembershipsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Memberships query and return a TeamMembershipConnection
   *
   * @param variables - variables without 'id' to pass into the Team_MembershipsQuery
   * @returns parsed response from Team_MembershipsQuery
   */
  public async fetch(variables?: Omit<L.Team_MembershipsQueryVariables, "id">): Fetch<TeamMembershipConnection> {
    return this._request<L.Team_MembershipsQuery, L.Team_MembershipsQueryVariables>(L.Team_MembershipsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.memberships;
      return data
        ? new TeamMembershipConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_Projects Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_ProjectsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Projects query and return a ProjectConnection
   *
   * @param variables - variables without 'id' to pass into the Team_ProjectsQuery
   * @returns parsed response from Team_ProjectsQuery
   */
  public async fetch(variables?: Omit<L.Team_ProjectsQueryVariables, "id">): Fetch<ProjectConnection> {
    return this._request<L.Team_ProjectsQuery, L.Team_ProjectsQueryVariables>(L.Team_ProjectsDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.projects;
      return data
        ? new ProjectConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_States Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_StatesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_States query and return a WorkflowStateConnection
   *
   * @param variables - variables without 'id' to pass into the Team_StatesQuery
   * @returns parsed response from Team_StatesQuery
   */
  public async fetch(variables?: Omit<L.Team_StatesQueryVariables, "id">): Fetch<WorkflowStateConnection> {
    return this._request<L.Team_StatesQuery, L.Team_StatesQueryVariables>(L.Team_StatesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.states;
      return data
        ? new WorkflowStateConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Team_Templates Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_TemplatesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Templates query and return a TemplateConnection
   *
   * @param variables - variables without 'id' to pass into the Team_TemplatesQuery
   * @returns parsed response from Team_TemplatesQuery
   */
  public async fetch(variables?: Omit<L.Team_TemplatesQueryVariables, "id">): Fetch<TemplateConnection> {
    return this._request<L.Team_TemplatesQuery, L.Team_TemplatesQueryVariables>(L.Team_TemplatesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.templates;
      return data ? new TemplateConnection(this._request, data) : undefined;
    });
  }
}

/**
 * A fetchable Team_Webhooks Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to team
 */
export class Team_WebhooksQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the Team_Webhooks query and return a WebhookConnection
   *
   * @param variables - variables without 'id' to pass into the Team_WebhooksQuery
   * @returns parsed response from Team_WebhooksQuery
   */
  public async fetch(variables?: Omit<L.Team_WebhooksQueryVariables, "id">): Fetch<WebhookConnection> {
    return this._request<L.Team_WebhooksQuery, L.Team_WebhooksQueryVariables>(L.Team_WebhooksDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.team?.webhooks;
      return data
        ? new WebhookConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable User_AssignedIssues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to user
 */
export class User_AssignedIssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the User_AssignedIssues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the User_AssignedIssuesQuery
   * @returns parsed response from User_AssignedIssuesQuery
   */
  public async fetch(variables?: Omit<L.User_AssignedIssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.User_AssignedIssuesQuery, L.User_AssignedIssuesQueryVariables>(
      L.User_AssignedIssuesDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.user?.assignedIssues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable User_CreatedIssues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to user
 */
export class User_CreatedIssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the User_CreatedIssues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the User_CreatedIssuesQuery
   * @returns parsed response from User_CreatedIssuesQuery
   */
  public async fetch(variables?: Omit<L.User_CreatedIssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.User_CreatedIssuesQuery, L.User_CreatedIssuesQueryVariables>(L.User_CreatedIssuesDocument, {
      id: this._id,
      ...variables,
    }).then(response => {
      const data = response?.user?.createdIssues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable User_TeamMemberships Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to user
 */
export class User_TeamMembershipsQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the User_TeamMemberships query and return a TeamMembershipConnection
   *
   * @param variables - variables without 'id' to pass into the User_TeamMembershipsQuery
   * @returns parsed response from User_TeamMembershipsQuery
   */
  public async fetch(variables?: Omit<L.User_TeamMembershipsQueryVariables, "id">): Fetch<TeamMembershipConnection> {
    return this._request<L.User_TeamMembershipsQuery, L.User_TeamMembershipsQueryVariables>(
      L.User_TeamMembershipsDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.user?.teamMemberships;
      return data
        ? new TeamMembershipConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Viewer_AssignedIssues Query
 *
 * @param request - function to call the graphql client
 */
export class Viewer_AssignedIssuesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Viewer_AssignedIssues query and return a IssueConnection
   *
   * @param variables - variables to pass into the Viewer_AssignedIssuesQuery
   * @returns parsed response from Viewer_AssignedIssuesQuery
   */
  public async fetch(variables?: L.Viewer_AssignedIssuesQueryVariables): Fetch<IssueConnection> {
    return this._request<L.Viewer_AssignedIssuesQuery, L.Viewer_AssignedIssuesQueryVariables>(
      L.Viewer_AssignedIssuesDocument,
      variables
    ).then(response => {
      const data = response?.viewer?.assignedIssues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Viewer_CreatedIssues Query
 *
 * @param request - function to call the graphql client
 */
export class Viewer_CreatedIssuesQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Viewer_CreatedIssues query and return a IssueConnection
   *
   * @param variables - variables to pass into the Viewer_CreatedIssuesQuery
   * @returns parsed response from Viewer_CreatedIssuesQuery
   */
  public async fetch(variables?: L.Viewer_CreatedIssuesQueryVariables): Fetch<IssueConnection> {
    return this._request<L.Viewer_CreatedIssuesQuery, L.Viewer_CreatedIssuesQueryVariables>(
      L.Viewer_CreatedIssuesDocument,
      variables
    ).then(response => {
      const data = response?.viewer?.createdIssues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable Viewer_TeamMemberships Query
 *
 * @param request - function to call the graphql client
 */
export class Viewer_TeamMembershipsQuery extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Call the Viewer_TeamMemberships query and return a TeamMembershipConnection
   *
   * @param variables - variables to pass into the Viewer_TeamMembershipsQuery
   * @returns parsed response from Viewer_TeamMembershipsQuery
   */
  public async fetch(variables?: L.Viewer_TeamMembershipsQueryVariables): Fetch<TeamMembershipConnection> {
    return this._request<L.Viewer_TeamMembershipsQuery, L.Viewer_TeamMembershipsQueryVariables>(
      L.Viewer_TeamMembershipsDocument,
      variables
    ).then(response => {
      const data = response?.viewer?.teamMemberships;
      return data
        ? new TeamMembershipConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * A fetchable WorkflowState_Issues Query
 *
 * @param request - function to call the graphql client
 * @param id - required id to pass to workflowState
 */
export class WorkflowState_IssuesQuery extends LinearRequest {
  private _id: string;

  public constructor(request: Request, id: string) {
    super(request);
    this._id = id;
  }

  /**
   * Call the WorkflowState_Issues query and return a IssueConnection
   *
   * @param variables - variables without 'id' to pass into the WorkflowState_IssuesQuery
   * @returns parsed response from WorkflowState_IssuesQuery
   */
  public async fetch(variables?: Omit<L.WorkflowState_IssuesQueryVariables, "id">): Fetch<IssueConnection> {
    return this._request<L.WorkflowState_IssuesQuery, L.WorkflowState_IssuesQueryVariables>(
      L.WorkflowState_IssuesDocument,
      {
        id: this._id,
        ...variables,
      }
    ).then(response => {
      const data = response?.workflowState?.issues;
      return data
        ? new IssueConnection(this._request, pagination => this.fetch({ ...variables, ...pagination }), data)
        : undefined;
    });
  }
}

/**
 * The SDK class containing all root operations
 *
 * @param request - function to call the graphql client
 */
export class LinearSdk extends LinearRequest {
  public constructor(request: Request) {
    super(request);
  }

  /**
   * Query apiKeys for ApiKeyConnection
   * All API keys for the user.
   *
   * @param variables - variables to pass into the ApiKeysQuery
   * @returns ApiKeyConnection
   */
  public apiKeys(variables?: L.ApiKeysQueryVariables): Fetch<ApiKeyConnection> {
    return new ApiKeysQuery(this._request).fetch(variables);
  }
  /**
   * Query applicationWithAuthorization for UserAuthorizedApplication
   * Get information for an application and whether a user has approved it for the given scopes.
   *
   * @param clientId - required clientId to pass to applicationWithAuthorization
   * @param scope - required scope to pass to applicationWithAuthorization
   * @param variables - variables without 'clientId', 'scope' to pass into the ApplicationWithAuthorizationQuery
   * @returns UserAuthorizedApplication
   */
  public applicationWithAuthorization(
    clientId: string,
    scope: string[],
    variables?: Omit<L.ApplicationWithAuthorizationQueryVariables, "clientId" | "scope">
  ): Fetch<UserAuthorizedApplication> {
    return new ApplicationWithAuthorizationQuery(this._request).fetch(clientId, scope, variables);
  }
  /**
   * Query archivedModelSync for ArchiveResponse
   * Fetches an archived model.
   *
   * @param identifier - required identifier to pass to archivedModelSync
   * @param modelClass - required modelClass to pass to archivedModelSync
   * @returns ArchiveResponse
   */
  public archivedModelSync(identifier: string, modelClass: string): Fetch<ArchiveResponse> {
    return new ArchivedModelSyncQuery(this._request).fetch(identifier, modelClass);
  }
  /**
   * Query archivedModelsSync for ArchiveResponse
   * Fetches archived models.
   *
   * @param modelClass - required modelClass to pass to archivedModelsSync
   * @param teamId - required teamId to pass to archivedModelsSync
   * @param variables - variables without 'modelClass', 'teamId' to pass into the ArchivedModelsSyncQuery
   * @returns ArchiveResponse
   */
  public archivedModelsSync(
    modelClass: string,
    teamId: string,
    variables?: Omit<L.ArchivedModelsSyncQueryVariables, "modelClass" | "teamId">
  ): Fetch<ArchiveResponse> {
    return new ArchivedModelsSyncQuery(this._request).fetch(modelClass, teamId, variables);
  }
  /**
   * Query authorizedApplications for AuthorizedApplications
   * Get all authorized applications for a user
   *
   * @returns AuthorizedApplication[]
   */
  public get authorizedApplications(): Fetch<AuthorizedApplication[]> {
    return new AuthorizedApplicationsQuery(this._request).fetch();
  }
  /**
   * Query availableUsers for AuthResolverResponse
   * Fetch users belonging to this user account.
   *
   * @returns AuthResolverResponse
   */
  public get availableUsers(): Fetch<AuthResolverResponse> {
    return new AvailableUsersQuery(this._request).fetch();
  }
  /**
   * Query billingDetails for BillingDetailsPayload
   * Billing details for the customer.
   *
   * @returns BillingDetailsPayload
   */
  public get billingDetails(): Fetch<BillingDetailsPayload> {
    return new BillingDetailsQuery(this._request).fetch();
  }
  /**
   * Query collaborativeDocumentJoin for CollaborationDocumentUpdatePayload
   * Join collaborative document and get missing steps.
   *
   * @param clientId - required clientId to pass to collaborativeDocumentJoin
   * @param issueId - required issueId to pass to collaborativeDocumentJoin
   * @param version - required version to pass to collaborativeDocumentJoin
   * @returns CollaborationDocumentUpdatePayload
   */
  public collaborativeDocumentJoin(
    clientId: string,
    issueId: string,
    version: number
  ): Fetch<CollaborationDocumentUpdatePayload> {
    return new CollaborativeDocumentJoinQuery(this._request).fetch(clientId, issueId, version);
  }
  /**
   * Query comment for Comment
   * A specific comment.
   *
   * @param id - required id to pass to comment
   * @returns Comment
   */
  public comment(id: string): Fetch<Comment> {
    return new CommentQuery(this._request).fetch(id);
  }
  /**
   * Query comments for CommentConnection
   * All comments.
   *
   * @param variables - variables to pass into the CommentsQuery
   * @returns CommentConnection
   */
  public comments(variables?: L.CommentsQueryVariables): Fetch<CommentConnection> {
    return new CommentsQuery(this._request).fetch(variables);
  }
  /**
   * Query customView for CustomView
   * One specific custom view.
   *
   * @param id - required id to pass to customView
   * @returns CustomView
   */
  public customView(id: string): Fetch<CustomView> {
    return new CustomViewQuery(this._request).fetch(id);
  }
  /**
   * Query customViews for CustomViewConnection
   * Custom views for the user.
   *
   * @param variables - variables to pass into the CustomViewsQuery
   * @returns CustomViewConnection
   */
  public customViews(variables?: L.CustomViewsQueryVariables): Fetch<CustomViewConnection> {
    return new CustomViewsQuery(this._request).fetch(variables);
  }
  /**
   * Query cycle for Cycle
   * One specific cycle.
   *
   * @param id - required id to pass to cycle
   * @returns Cycle
   */
  public cycle(id: string): Fetch<Cycle> {
    return new CycleQuery(this._request).fetch(id);
  }
  /**
   * Query cycles for CycleConnection
   * All cycles.
   *
   * @param variables - variables to pass into the CyclesQuery
   * @returns CycleConnection
   */
  public cycles(variables?: L.CyclesQueryVariables): Fetch<CycleConnection> {
    return new CyclesQuery(this._request).fetch(variables);
  }
  /**
   * Query emoji for Emoji
   * A specific emoji.
   *
   * @param id - required id to pass to emoji
   * @returns Emoji
   */
  public emoji(id: string): Fetch<Emoji> {
    return new EmojiQuery(this._request).fetch(id);
  }
  /**
   * Query emojis for EmojiConnection
   * All custom emojis.
   *
   * @param variables - variables to pass into the EmojisQuery
   * @returns EmojiConnection
   */
  public emojis(variables?: L.EmojisQueryVariables): Fetch<EmojiConnection> {
    return new EmojisQuery(this._request).fetch(variables);
  }
  /**
   * Query favorite for Favorite
   * One specific favorite.
   *
   * @param id - required id to pass to favorite
   * @returns Favorite
   */
  public favorite(id: string): Fetch<Favorite> {
    return new FavoriteQuery(this._request).fetch(id);
  }
  /**
   * Query favorites for FavoriteConnection
   * The user's favorites.
   *
   * @param variables - variables to pass into the FavoritesQuery
   * @returns FavoriteConnection
   */
  public favorites(variables?: L.FavoritesQueryVariables): Fetch<FavoriteConnection> {
    return new FavoritesQuery(this._request).fetch(variables);
  }
  /**
   * Query figmaEmbedInfo for FigmaEmbedPayload
   * Fetch Figma screenshot and other information with file and node identifiers.
   *
   * @param fileId - required fileId to pass to figmaEmbedInfo
   * @param variables - variables without 'fileId' to pass into the FigmaEmbedInfoQuery
   * @returns FigmaEmbedPayload
   */
  public figmaEmbedInfo(
    fileId: string,
    variables?: Omit<L.FigmaEmbedInfoQueryVariables, "fileId">
  ): Fetch<FigmaEmbedPayload> {
    return new FigmaEmbedInfoQuery(this._request).fetch(fileId, variables);
  }
  /**
   * Query integration for Integration
   * One specific integration.
   *
   * @param id - required id to pass to integration
   * @returns Integration
   */
  public integration(id: string): Fetch<Integration> {
    return new IntegrationQuery(this._request).fetch(id);
  }
  /**
   * Query integrationResource for IntegrationResource
   * One specific integration resource. (e.g. linked GitHub pull requests for an issue)
   *
   * @param id - required id to pass to integrationResource
   * @returns IntegrationResource
   */
  public integrationResource(id: string): Fetch<IntegrationResource> {
    return new IntegrationResourceQuery(this._request).fetch(id);
  }
  /**
   * Query integrationResources for IntegrationResourceConnection
   * All integrations resources (e.g. linked GitHub pull requests for issues).
   *
   * @param variables - variables to pass into the IntegrationResourcesQuery
   * @returns IntegrationResourceConnection
   */
  public integrationResources(variables?: L.IntegrationResourcesQueryVariables): Fetch<IntegrationResourceConnection> {
    return new IntegrationResourcesQuery(this._request).fetch(variables);
  }
  /**
   * Query integrations for IntegrationConnection
   * All integrations.
   *
   * @param variables - variables to pass into the IntegrationsQuery
   * @returns IntegrationConnection
   */
  public integrations(variables?: L.IntegrationsQueryVariables): Fetch<IntegrationConnection> {
    return new IntegrationsQuery(this._request).fetch(variables);
  }
  /**
   * Query inviteInfo for InvitePagePayload
   * Retrieves information for the public invite page.
   *
   * @param userHash - required userHash to pass to inviteInfo
   * @param variables - variables without 'userHash' to pass into the InviteInfoQuery
   * @returns InvitePagePayload
   */
  public inviteInfo(
    userHash: string,
    variables?: Omit<L.InviteInfoQueryVariables, "userHash">
  ): Fetch<InvitePagePayload> {
    return new InviteInfoQuery(this._request).fetch(userHash, variables);
  }
  /**
   * Query issue for Issue
   * One specific issue.
   *
   * @param id - required id to pass to issue
   * @returns Issue
   */
  public issue(id: string): Fetch<Issue> {
    return new IssueQuery(this._request).fetch(id);
  }
  /**
   * Query issueLabel for IssueLabel
   * One specific label.
   *
   * @param id - required id to pass to issueLabel
   * @returns IssueLabel
   */
  public issueLabel(id: string): Fetch<IssueLabel> {
    return new IssueLabelQuery(this._request).fetch(id);
  }
  /**
   * Query issueLabels for IssueLabelConnection
   * All issue labels.
   *
   * @param variables - variables to pass into the IssueLabelsQuery
   * @returns IssueLabelConnection
   */
  public issueLabels(variables?: L.IssueLabelsQueryVariables): Fetch<IssueLabelConnection> {
    return new IssueLabelsQuery(this._request).fetch(variables);
  }
  /**
   * Query issueRelation for IssueRelation
   * One specific issue relation.
   *
   * @param id - required id to pass to issueRelation
   * @returns IssueRelation
   */
  public issueRelation(id: string): Fetch<IssueRelation> {
    return new IssueRelationQuery(this._request).fetch(id);
  }
  /**
   * Query issueRelations for IssueRelationConnection
   * All issue relationships.
   *
   * @param variables - variables to pass into the IssueRelationsQuery
   * @returns IssueRelationConnection
   */
  public issueRelations(variables?: L.IssueRelationsQueryVariables): Fetch<IssueRelationConnection> {
    return new IssueRelationsQuery(this._request).fetch(variables);
  }
  /**
   * Query issueSearch for IssueConnection
   * [ALPHA] Search issues. This query is experimental and is subject to change without notice.
   *
   * @param query - required query to pass to issueSearch
   * @param variables - variables without 'query' to pass into the IssueSearchQuery
   * @returns IssueConnection
   */
  public issueSearch(query: string, variables?: Omit<L.IssueSearchQueryVariables, "query">): Fetch<IssueConnection> {
    return new IssueSearchQuery(this._request).fetch(query, variables);
  }
  /**
   * Query issues for IssueConnection
   * All issues.
   *
   * @param variables - variables to pass into the IssuesQuery
   * @returns IssueConnection
   */
  public issues(variables?: L.IssuesQueryVariables): Fetch<IssueConnection> {
    return new IssuesQuery(this._request).fetch(variables);
  }
  /**
   * Query milestone for Milestone
   * One specific milestone.
   *
   * @param id - required id to pass to milestone
   * @returns Milestone
   */
  public milestone(id: string): Fetch<Milestone> {
    return new MilestoneQuery(this._request).fetch(id);
  }
  /**
   * Query milestones for MilestoneConnection
   * All milestones.
   *
   * @param variables - variables to pass into the MilestonesQuery
   * @returns MilestoneConnection
   */
  public milestones(variables?: L.MilestonesQueryVariables): Fetch<MilestoneConnection> {
    return new MilestonesQuery(this._request).fetch(variables);
  }
  /**
   * Query notification for Notification
   * One specific notification.
   *
   * @param id - required id to pass to notification
   * @returns Notification
   */
  public notification(id: string): Fetch<Notification> {
    return new NotificationQuery(this._request).fetch(id);
  }
  /**
   * Query notificationSubscription for NotificationSubscription
   * One specific notification subscription.
   *
   * @param id - required id to pass to notificationSubscription
   * @returns NotificationSubscription
   */
  public notificationSubscription(id: string): Fetch<NotificationSubscription> {
    return new NotificationSubscriptionQuery(this._request).fetch(id);
  }
  /**
   * Query notificationSubscriptions for NotificationSubscriptionConnection
   * The user's notification subscriptions.
   *
   * @param variables - variables to pass into the NotificationSubscriptionsQuery
   * @returns NotificationSubscriptionConnection
   */
  public notificationSubscriptions(
    variables?: L.NotificationSubscriptionsQueryVariables
  ): Fetch<NotificationSubscriptionConnection> {
    return new NotificationSubscriptionsQuery(this._request).fetch(variables);
  }
  /**
   * Query notifications for NotificationConnection
   * All notifications.
   *
   * @param variables - variables to pass into the NotificationsQuery
   * @returns NotificationConnection
   */
  public notifications(variables?: L.NotificationsQueryVariables): Fetch<NotificationConnection> {
    return new NotificationsQuery(this._request).fetch(variables);
  }
  /**
   * Query organization for Organization
   * The user's organization.
   *
   * @returns Organization
   */
  public get organization(): Fetch<Organization> {
    return new OrganizationQuery(this._request).fetch();
  }
  /**
   * Query organizationExists for OrganizationExistsPayload
   * Does the organization exist.
   *
   * @param urlKey - required urlKey to pass to organizationExists
   * @returns OrganizationExistsPayload
   */
  public organizationExists(urlKey: string): Fetch<OrganizationExistsPayload> {
    return new OrganizationExistsQuery(this._request).fetch(urlKey);
  }
  /**
   * Query organizationInvite for IssueLabel
   * One specific organization invite.
   *
   * @param id - required id to pass to organizationInvite
   * @returns IssueLabel
   */
  public organizationInvite(id: string): Fetch<IssueLabel> {
    return new OrganizationInviteQuery(this._request).fetch(id);
  }
  /**
   * Query organizationInvites for OrganizationInviteConnection
   * All invites for the organization.
   *
   * @param variables - variables to pass into the OrganizationInvitesQuery
   * @returns OrganizationInviteConnection
   */
  public organizationInvites(variables?: L.OrganizationInvitesQueryVariables): Fetch<OrganizationInviteConnection> {
    return new OrganizationInvitesQuery(this._request).fetch(variables);
  }
  /**
   * Query project for Project
   * One specific project.
   *
   * @param id - required id to pass to project
   * @returns Project
   */
  public project(id: string): Fetch<Project> {
    return new ProjectQuery(this._request).fetch(id);
  }
  /**
   * Query projectLink for ProjectLink
   * One specific project link.
   *
   * @param id - required id to pass to projectLink
   * @returns ProjectLink
   */
  public projectLink(id: string): Fetch<ProjectLink> {
    return new ProjectLinkQuery(this._request).fetch(id);
  }
  /**
   * Query projectLinks for ProjectLinkConnection
   * All links for the project.
   *
   * @param variables - variables to pass into the ProjectLinksQuery
   * @returns ProjectLinkConnection
   */
  public projectLinks(variables?: L.ProjectLinksQueryVariables): Fetch<ProjectLinkConnection> {
    return new ProjectLinksQuery(this._request).fetch(variables);
  }
  /**
   * Query projects for ProjectConnection
   * All projects.
   *
   * @param variables - variables to pass into the ProjectsQuery
   * @returns ProjectConnection
   */
  public projects(variables?: L.ProjectsQueryVariables): Fetch<ProjectConnection> {
    return new ProjectsQuery(this._request).fetch(variables);
  }
  /**
   * Query pushSubscriptionTest for PushSubscriptionPayload
   * Sends a test push message.
   *
   * @returns PushSubscriptionPayload
   */
  public get pushSubscriptionTest(): Fetch<PushSubscriptionPayload> {
    return new PushSubscriptionTestQuery(this._request).fetch();
  }
  /**
   * Query reaction for Reaction
   * A specific reaction.
   *
   * @param id - required id to pass to reaction
   * @returns Reaction
   */
  public reaction(id: string): Fetch<Reaction> {
    return new ReactionQuery(this._request).fetch(id);
  }
  /**
   * Query reactions for ReactionConnection
   * All comment emoji reactions.
   *
   * @param variables - variables to pass into the ReactionsQuery
   * @returns ReactionConnection
   */
  public reactions(variables?: L.ReactionsQueryVariables): Fetch<ReactionConnection> {
    return new ReactionsQuery(this._request).fetch(variables);
  }
  /**
   * Query ssoUrlFromEmail for SsoUrlFromEmailResponse
   * Fetch SSO login URL for the email provided.
   *
   * @param email - required email to pass to ssoUrlFromEmail
   * @param variables - variables without 'email' to pass into the SsoUrlFromEmailQuery
   * @returns SsoUrlFromEmailResponse
   */
  public ssoUrlFromEmail(
    email: string,
    variables?: Omit<L.SsoUrlFromEmailQueryVariables, "email">
  ): Fetch<SsoUrlFromEmailResponse> {
    return new SsoUrlFromEmailQuery(this._request).fetch(email, variables);
  }
  /**
   * Query syncBootstrap for SyncResponse
   * Fetch data to catch up the client to the state of the world.
   *
   * @param databaseVersion - required databaseVersion to pass to syncBootstrap
   * @param sinceSyncId - required sinceSyncId to pass to syncBootstrap
   * @returns SyncResponse
   */
  public syncBootstrap(databaseVersion: number, sinceSyncId: number): Fetch<SyncResponse> {
    return new SyncBootstrapQuery(this._request).fetch(databaseVersion, sinceSyncId);
  }
  /**
   * Query syncUpdates for SyncResponse
   * Fetches delta packets to catch up the user to the current state of the world.
   *
   * @param sinceSyncId - required sinceSyncId to pass to syncUpdates
   * @returns SyncResponse
   */
  public syncUpdates(sinceSyncId: number): Fetch<SyncResponse> {
    return new SyncUpdatesQuery(this._request).fetch(sinceSyncId);
  }
  /**
   * Query team for Team
   * One specific team.
   *
   * @param id - required id to pass to team
   * @returns Team
   */
  public team(id: string): Fetch<Team> {
    return new TeamQuery(this._request).fetch(id);
  }
  /**
   * Query teamMembership for TeamMembership
   * One specific team membership.
   *
   * @param id - required id to pass to teamMembership
   * @returns TeamMembership
   */
  public teamMembership(id: string): Fetch<TeamMembership> {
    return new TeamMembershipQuery(this._request).fetch(id);
  }
  /**
   * Query teamMemberships for TeamMembershipConnection
   * All team memberships.
   *
   * @param variables - variables to pass into the TeamMembershipsQuery
   * @returns TeamMembershipConnection
   */
  public teamMemberships(variables?: L.TeamMembershipsQueryVariables): Fetch<TeamMembershipConnection> {
    return new TeamMembershipsQuery(this._request).fetch(variables);
  }
  /**
   * Query teams for TeamConnection
   * All teams.
   *
   * @param variables - variables to pass into the TeamsQuery
   * @returns TeamConnection
   */
  public teams(variables?: L.TeamsQueryVariables): Fetch<TeamConnection> {
    return new TeamsQuery(this._request).fetch(variables);
  }
  /**
   * Query template for Template
   * A specific template.
   *
   * @param id - required id to pass to template
   * @returns Template
   */
  public template(id: string): Fetch<Template> {
    return new TemplateQuery(this._request).fetch(id);
  }
  /**
   * Query templates for Templates
   * All templates from all users.
   *
   * @returns Template[]
   */
  public get templates(): Fetch<Template[]> {
    return new TemplatesQuery(this._request).fetch();
  }
  /**
   * Query user for User
   * One specific user.
   *
   * @param id - required id to pass to user
   * @returns User
   */
  public user(id: string): Fetch<User> {
    return new UserQuery(this._request).fetch(id);
  }
  /**
   * Query userSettings for UserSettings
   * The user's settings.
   *
   * @returns UserSettings
   */
  public get userSettings(): Fetch<UserSettings> {
    return new UserSettingsQuery(this._request).fetch();
  }
  /**
   * Query users for UserConnection
   * All users for the organization.
   *
   * @param variables - variables to pass into the UsersQuery
   * @returns UserConnection
   */
  public users(variables?: L.UsersQueryVariables): Fetch<UserConnection> {
    return new UsersQuery(this._request).fetch(variables);
  }
  /**
   * Query viewer for User
   * The currently authenticated user.
   *
   * @returns User
   */
  public get viewer(): Fetch<User> {
    return new ViewerQuery(this._request).fetch();
  }
  /**
   * Query webhook for Webhook
   * A specific webhook.
   *
   * @param id - required id to pass to webhook
   * @returns Webhook
   */
  public webhook(id: string): Fetch<Webhook> {
    return new WebhookQuery(this._request).fetch(id);
  }
  /**
   * Query webhooks for WebhookConnection
   * All webhooks.
   *
   * @param variables - variables to pass into the WebhooksQuery
   * @returns WebhookConnection
   */
  public webhooks(variables?: L.WebhooksQueryVariables): Fetch<WebhookConnection> {
    return new WebhooksQuery(this._request).fetch(variables);
  }
  /**
   * Query workflowState for WorkflowState
   * One specific state.
   *
   * @param id - required id to pass to workflowState
   * @returns WorkflowState
   */
  public workflowState(id: string): Fetch<WorkflowState> {
    return new WorkflowStateQuery(this._request).fetch(id);
  }
  /**
   * Query workflowStates for WorkflowStateConnection
   * All issue workflow states.
   *
   * @param variables - variables to pass into the WorkflowStatesQuery
   * @returns WorkflowStateConnection
   */
  public workflowStates(variables?: L.WorkflowStatesQueryVariables): Fetch<WorkflowStateConnection> {
    return new WorkflowStatesQuery(this._request).fetch(variables);
  }
  /**
   * Mutation apiKeyCreate for ApiKeyPayload
   *
   * @param input - required input to pass to apiKeyCreate
   * @returns ApiKeyPayload
   */
  public apiKeyCreate(input: L.ApiKeyCreateInput): Fetch<ApiKeyPayload> {
    return new ApiKeyCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation apiKeyDelete for ArchivePayload
   *
   * @param id - required id to pass to apiKeyDelete
   * @returns ArchivePayload
   */
  public apiKeyDelete(id: string): Fetch<ArchivePayload> {
    return new ApiKeyDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation billingEmailUpdate for BillingEmailPayload
   *
   * @param input - required input to pass to billingEmailUpdate
   * @returns BillingEmailPayload
   */
  public billingEmailUpdate(input: L.BillingEmailUpdateInput): Fetch<BillingEmailPayload> {
    return new BillingEmailUpdateMutation(this._request).fetch(input);
  }
  /**
   * Mutation collaborativeDocumentUpdate for CollaborationDocumentUpdatePayload
   *
   * @param input - required input to pass to collaborativeDocumentUpdate
   * @returns CollaborationDocumentUpdatePayload
   */
  public collaborativeDocumentUpdate(
    input: L.CollaborationDocumentUpdateInput
  ): Fetch<CollaborationDocumentUpdatePayload> {
    return new CollaborativeDocumentUpdateMutation(this._request).fetch(input);
  }
  /**
   * Mutation commentCreate for CommentPayload
   *
   * @param input - required input to pass to commentCreate
   * @returns CommentPayload
   */
  public commentCreate(input: L.CommentCreateInput): Fetch<CommentPayload> {
    return new CommentCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation commentDelete for ArchivePayload
   *
   * @param id - required id to pass to commentDelete
   * @returns ArchivePayload
   */
  public commentDelete(id: string): Fetch<ArchivePayload> {
    return new CommentDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation commentUpdate for CommentPayload
   *
   * @param id - required id to pass to commentUpdate
   * @param input - required input to pass to commentUpdate
   * @returns CommentPayload
   */
  public commentUpdate(id: string, input: L.CommentUpdateInput): Fetch<CommentPayload> {
    return new CommentUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation contactCreate for ContactPayload
   *
   * @param input - required input to pass to contactCreate
   * @returns ContactPayload
   */
  public contactCreate(input: L.ContactCreateInput): Fetch<ContactPayload> {
    return new ContactCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation createCsvExportReport for CreateCsvExportReportPayload
   *
   * @returns CreateCsvExportReportPayload
   */
  public get createCsvExportReport(): Fetch<CreateCsvExportReportPayload> {
    return new CreateCsvExportReportMutation(this._request).fetch();
  }
  /**
   * Mutation createOrganizationFromOnboarding for CreateOrJoinOrganizationResponse
   *
   * @param input - required input to pass to createOrganizationFromOnboarding
   * @param variables - variables without 'input' to pass into the CreateOrganizationFromOnboardingMutation
   * @returns CreateOrJoinOrganizationResponse
   */
  public createOrganizationFromOnboarding(
    input: L.CreateOrganizationInput,
    variables?: Omit<L.CreateOrganizationFromOnboardingMutationVariables, "input">
  ): Fetch<CreateOrJoinOrganizationResponse> {
    return new CreateOrganizationFromOnboardingMutation(this._request).fetch(input, variables);
  }
  /**
   * Mutation customViewCreate for CustomViewPayload
   *
   * @param input - required input to pass to customViewCreate
   * @returns CustomViewPayload
   */
  public customViewCreate(input: L.CustomViewCreateInput): Fetch<CustomViewPayload> {
    return new CustomViewCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation customViewDelete for ArchivePayload
   *
   * @param id - required id to pass to customViewDelete
   * @returns ArchivePayload
   */
  public customViewDelete(id: string): Fetch<ArchivePayload> {
    return new CustomViewDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation customViewUpdate for CustomViewPayload
   *
   * @param id - required id to pass to customViewUpdate
   * @param input - required input to pass to customViewUpdate
   * @returns CustomViewPayload
   */
  public customViewUpdate(id: string, input: L.CustomViewUpdateInput): Fetch<CustomViewPayload> {
    return new CustomViewUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation cycleArchive for ArchivePayload
   *
   * @param id - required id to pass to cycleArchive
   * @returns ArchivePayload
   */
  public cycleArchive(id: string): Fetch<ArchivePayload> {
    return new CycleArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation cycleCreate for CyclePayload
   *
   * @param input - required input to pass to cycleCreate
   * @returns CyclePayload
   */
  public cycleCreate(input: L.CycleCreateInput): Fetch<CyclePayload> {
    return new CycleCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation cycleUpdate for CyclePayload
   *
   * @param id - required id to pass to cycleUpdate
   * @param input - required input to pass to cycleUpdate
   * @returns CyclePayload
   */
  public cycleUpdate(id: string, input: L.CycleUpdateInput): Fetch<CyclePayload> {
    return new CycleUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation debugCreateSAMLOrg for DebugPayload
   *
   * @returns DebugPayload
   */
  public get debugCreateSAMLOrg(): Fetch<DebugPayload> {
    return new DebugCreateSamlOrgMutation(this._request).fetch();
  }
  /**
   * Mutation debugFailWithInternalError for DebugPayload
   *
   * @returns DebugPayload
   */
  public get debugFailWithInternalError(): Fetch<DebugPayload> {
    return new DebugFailWithInternalErrorMutation(this._request).fetch();
  }
  /**
   * Mutation debugFailWithWarning for DebugPayload
   *
   * @returns DebugPayload
   */
  public get debugFailWithWarning(): Fetch<DebugPayload> {
    return new DebugFailWithWarningMutation(this._request).fetch();
  }
  /**
   * Mutation emailTokenUserAccountAuth for AuthResolverResponse
   *
   * @param input - required input to pass to emailTokenUserAccountAuth
   * @returns AuthResolverResponse
   */
  public emailTokenUserAccountAuth(input: L.TokenUserAccountAuthInput): Fetch<AuthResolverResponse> {
    return new EmailTokenUserAccountAuthMutation(this._request).fetch(input);
  }
  /**
   * Mutation emailUnsubscribe for EmailUnsubscribePayload
   *
   * @param input - required input to pass to emailUnsubscribe
   * @returns EmailUnsubscribePayload
   */
  public emailUnsubscribe(input: L.EmailUnsubscribeInput): Fetch<EmailUnsubscribePayload> {
    return new EmailUnsubscribeMutation(this._request).fetch(input);
  }
  /**
   * Mutation emailUserAccountAuthChallenge for EmailUserAccountAuthChallengeResponse
   *
   * @param input - required input to pass to emailUserAccountAuthChallenge
   * @returns EmailUserAccountAuthChallengeResponse
   */
  public emailUserAccountAuthChallenge(
    input: L.EmailUserAccountAuthChallengeInput
  ): Fetch<EmailUserAccountAuthChallengeResponse> {
    return new EmailUserAccountAuthChallengeMutation(this._request).fetch(input);
  }
  /**
   * Mutation emojiCreate for EmojiPayload
   *
   * @param input - required input to pass to emojiCreate
   * @returns EmojiPayload
   */
  public emojiCreate(input: L.EmojiCreateInput): Fetch<EmojiPayload> {
    return new EmojiCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation emojiDelete for ArchivePayload
   *
   * @param id - required id to pass to emojiDelete
   * @returns ArchivePayload
   */
  public emojiDelete(id: string): Fetch<ArchivePayload> {
    return new EmojiDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation eventCreate for EventPayload
   *
   * @param input - required input to pass to eventCreate
   * @returns EventPayload
   */
  public eventCreate(input: L.EventCreateInput): Fetch<EventPayload> {
    return new EventCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation favoriteCreate for FavoritePayload
   *
   * @param input - required input to pass to favoriteCreate
   * @returns FavoritePayload
   */
  public favoriteCreate(input: L.FavoriteCreateInput): Fetch<FavoritePayload> {
    return new FavoriteCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation favoriteDelete for ArchivePayload
   *
   * @param id - required id to pass to favoriteDelete
   * @returns ArchivePayload
   */
  public favoriteDelete(id: string): Fetch<ArchivePayload> {
    return new FavoriteDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation favoriteUpdate for FavoritePayload
   *
   * @param id - required id to pass to favoriteUpdate
   * @param input - required input to pass to favoriteUpdate
   * @returns FavoritePayload
   */
  public favoriteUpdate(id: string, input: L.FavoriteUpdateInput): Fetch<FavoritePayload> {
    return new FavoriteUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation feedbackCreate for FeedbackPayload
   *
   * @param input - required input to pass to feedbackCreate
   * @returns FeedbackPayload
   */
  public feedbackCreate(input: L.FeedbackCreateInput): Fetch<FeedbackPayload> {
    return new FeedbackCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation fileUpload for UploadPayload
   *
   * @param contentType - required contentType to pass to fileUpload
   * @param filename - required filename to pass to fileUpload
   * @param size - required size to pass to fileUpload
   * @param variables - variables without 'contentType', 'filename', 'size' to pass into the FileUploadMutation
   * @returns UploadPayload
   */
  public fileUpload(
    contentType: string,
    filename: string,
    size: number,
    variables?: Omit<L.FileUploadMutationVariables, "contentType" | "filename" | "size">
  ): Fetch<UploadPayload> {
    return new FileUploadMutation(this._request).fetch(contentType, filename, size, variables);
  }
  /**
   * Mutation googleUserAccountAuth for AuthResolverResponse
   *
   * @param input - required input to pass to googleUserAccountAuth
   * @returns AuthResolverResponse
   */
  public googleUserAccountAuth(input: L.GoogleUserAccountAuthInput): Fetch<AuthResolverResponse> {
    return new GoogleUserAccountAuthMutation(this._request).fetch(input);
  }
  /**
   * Mutation imageUploadFromUrl for ImageUploadFromUrlPayload
   *
   * @param url - required url to pass to imageUploadFromUrl
   * @returns ImageUploadFromUrlPayload
   */
  public imageUploadFromUrl(url: string): Fetch<ImageUploadFromUrlPayload> {
    return new ImageUploadFromUrlMutation(this._request).fetch(url);
  }
  /**
   * Mutation integrationDelete for ArchivePayload
   *
   * @param id - required id to pass to integrationDelete
   * @returns ArchivePayload
   */
  public integrationDelete(id: string): Fetch<ArchivePayload> {
    return new IntegrationDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation integrationFigma for IntegrationPayload
   *
   * @param code - required code to pass to integrationFigma
   * @param redirectUri - required redirectUri to pass to integrationFigma
   * @returns IntegrationPayload
   */
  public integrationFigma(code: string, redirectUri: string): Fetch<IntegrationPayload> {
    return new IntegrationFigmaMutation(this._request).fetch(code, redirectUri);
  }
  /**
   * Mutation integrationGithubConnect for IntegrationPayload
   *
   * @param installationId - required installationId to pass to integrationGithubConnect
   * @returns IntegrationPayload
   */
  public integrationGithubConnect(installationId: string): Fetch<IntegrationPayload> {
    return new IntegrationGithubConnectMutation(this._request).fetch(installationId);
  }
  /**
   * Mutation integrationGitlabConnect for IntegrationPayload
   *
   * @param accessToken - required accessToken to pass to integrationGitlabConnect
   * @param gitlabUrl - required gitlabUrl to pass to integrationGitlabConnect
   * @returns IntegrationPayload
   */
  public integrationGitlabConnect(accessToken: string, gitlabUrl: string): Fetch<IntegrationPayload> {
    return new IntegrationGitlabConnectMutation(this._request).fetch(accessToken, gitlabUrl);
  }
  /**
   * Mutation integrationGoogleSheets for IntegrationPayload
   *
   * @param code - required code to pass to integrationGoogleSheets
   * @returns IntegrationPayload
   */
  public integrationGoogleSheets(code: string): Fetch<IntegrationPayload> {
    return new IntegrationGoogleSheetsMutation(this._request).fetch(code);
  }
  /**
   * Mutation integrationResourceArchive for ArchivePayload
   *
   * @param id - required id to pass to integrationResourceArchive
   * @returns ArchivePayload
   */
  public integrationResourceArchive(id: string): Fetch<ArchivePayload> {
    return new IntegrationResourceArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation integrationSentryConnect for IntegrationPayload
   *
   * @param code - required code to pass to integrationSentryConnect
   * @param installationId - required installationId to pass to integrationSentryConnect
   * @param organizationSlug - required organizationSlug to pass to integrationSentryConnect
   * @returns IntegrationPayload
   */
  public integrationSentryConnect(
    code: string,
    installationId: string,
    organizationSlug: string
  ): Fetch<IntegrationPayload> {
    return new IntegrationSentryConnectMutation(this._request).fetch(code, installationId, organizationSlug);
  }
  /**
   * Mutation integrationSlack for IntegrationPayload
   *
   * @param code - required code to pass to integrationSlack
   * @param redirectUri - required redirectUri to pass to integrationSlack
   * @param variables - variables without 'code', 'redirectUri' to pass into the IntegrationSlackMutation
   * @returns IntegrationPayload
   */
  public integrationSlack(
    code: string,
    redirectUri: string,
    variables?: Omit<L.IntegrationSlackMutationVariables, "code" | "redirectUri">
  ): Fetch<IntegrationPayload> {
    return new IntegrationSlackMutation(this._request).fetch(code, redirectUri, variables);
  }
  /**
   * Mutation integrationSlackImportEmojis for IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackImportEmojis
   * @param redirectUri - required redirectUri to pass to integrationSlackImportEmojis
   * @returns IntegrationPayload
   */
  public integrationSlackImportEmojis(code: string, redirectUri: string): Fetch<IntegrationPayload> {
    return new IntegrationSlackImportEmojisMutation(this._request).fetch(code, redirectUri);
  }
  /**
   * Mutation integrationSlackPersonal for IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackPersonal
   * @param redirectUri - required redirectUri to pass to integrationSlackPersonal
   * @returns IntegrationPayload
   */
  public integrationSlackPersonal(code: string, redirectUri: string): Fetch<IntegrationPayload> {
    return new IntegrationSlackPersonalMutation(this._request).fetch(code, redirectUri);
  }
  /**
   * Mutation integrationSlackPost for IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackPost
   * @param redirectUri - required redirectUri to pass to integrationSlackPost
   * @param teamId - required teamId to pass to integrationSlackPost
   * @param variables - variables without 'code', 'redirectUri', 'teamId' to pass into the IntegrationSlackPostMutation
   * @returns IntegrationPayload
   */
  public integrationSlackPost(
    code: string,
    redirectUri: string,
    teamId: string,
    variables?: Omit<L.IntegrationSlackPostMutationVariables, "code" | "redirectUri" | "teamId">
  ): Fetch<IntegrationPayload> {
    return new IntegrationSlackPostMutation(this._request).fetch(code, redirectUri, teamId, variables);
  }
  /**
   * Mutation integrationSlackProjectPost for IntegrationPayload
   *
   * @param code - required code to pass to integrationSlackProjectPost
   * @param projectId - required projectId to pass to integrationSlackProjectPost
   * @param redirectUri - required redirectUri to pass to integrationSlackProjectPost
   * @returns IntegrationPayload
   */
  public integrationSlackProjectPost(code: string, projectId: string, redirectUri: string): Fetch<IntegrationPayload> {
    return new IntegrationSlackProjectPostMutation(this._request).fetch(code, projectId, redirectUri);
  }
  /**
   * Mutation issueArchive for ArchivePayload
   *
   * @param id - required id to pass to issueArchive
   * @returns ArchivePayload
   */
  public issueArchive(id: string): Fetch<ArchivePayload> {
    return new IssueArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation issueCreate for IssuePayload
   *
   * @param input - required input to pass to issueCreate
   * @returns IssuePayload
   */
  public issueCreate(input: L.IssueCreateInput): Fetch<IssuePayload> {
    return new IssueCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation issueImportCreateGithub for IssueImportPayload
   *
   * @param githubRepoName - required githubRepoName to pass to issueImportCreateGithub
   * @param githubRepoOwner - required githubRepoOwner to pass to issueImportCreateGithub
   * @param githubToken - required githubToken to pass to issueImportCreateGithub
   * @param teamId - required teamId to pass to issueImportCreateGithub
   * @returns IssueImportPayload
   */
  public issueImportCreateGithub(
    githubRepoName: string,
    githubRepoOwner: string,
    githubToken: string,
    teamId: string
  ): Fetch<IssueImportPayload> {
    return new IssueImportCreateGithubMutation(this._request).fetch(
      githubRepoName,
      githubRepoOwner,
      githubToken,
      teamId
    );
  }
  /**
   * Mutation issueLabelArchive for ArchivePayload
   *
   * @param id - required id to pass to issueLabelArchive
   * @returns ArchivePayload
   */
  public issueLabelArchive(id: string): Fetch<ArchivePayload> {
    return new IssueLabelArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation issueLabelCreate for IssueLabelPayload
   *
   * @param input - required input to pass to issueLabelCreate
   * @returns IssueLabelPayload
   */
  public issueLabelCreate(input: L.IssueLabelCreateInput): Fetch<IssueLabelPayload> {
    return new IssueLabelCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation issueLabelUpdate for IssueLabelPayload
   *
   * @param id - required id to pass to issueLabelUpdate
   * @param input - required input to pass to issueLabelUpdate
   * @returns IssueLabelPayload
   */
  public issueLabelUpdate(id: string, input: L.IssueLabelUpdateInput): Fetch<IssueLabelPayload> {
    return new IssueLabelUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation issueRelationCreate for IssueRelationPayload
   *
   * @param input - required input to pass to issueRelationCreate
   * @returns IssueRelationPayload
   */
  public issueRelationCreate(input: L.IssueRelationCreateInput): Fetch<IssueRelationPayload> {
    return new IssueRelationCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation issueRelationDelete for ArchivePayload
   *
   * @param id - required id to pass to issueRelationDelete
   * @returns ArchivePayload
   */
  public issueRelationDelete(id: string): Fetch<ArchivePayload> {
    return new IssueRelationDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation issueRelationUpdate for IssueRelationPayload
   *
   * @param id - required id to pass to issueRelationUpdate
   * @param input - required input to pass to issueRelationUpdate
   * @returns IssueRelationPayload
   */
  public issueRelationUpdate(id: string, input: L.IssueRelationUpdateInput): Fetch<IssueRelationPayload> {
    return new IssueRelationUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation issueUnarchive for ArchivePayload
   *
   * @param id - required id to pass to issueUnarchive
   * @returns ArchivePayload
   */
  public issueUnarchive(id: string): Fetch<ArchivePayload> {
    return new IssueUnarchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation issueUpdate for IssuePayload
   *
   * @param id - required id to pass to issueUpdate
   * @param input - required input to pass to issueUpdate
   * @returns IssuePayload
   */
  public issueUpdate(id: string, input: L.IssueUpdateInput): Fetch<IssuePayload> {
    return new IssueUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation joinOrganizationFromOnboarding for CreateOrJoinOrganizationResponse
   *
   * @param input - required input to pass to joinOrganizationFromOnboarding
   * @returns CreateOrJoinOrganizationResponse
   */
  public joinOrganizationFromOnboarding(input: L.JoinOrganizationInput): Fetch<CreateOrJoinOrganizationResponse> {
    return new JoinOrganizationFromOnboardingMutation(this._request).fetch(input);
  }
  /**
   * Mutation leaveOrganization for CreateOrJoinOrganizationResponse
   *
   * @param organizationId - required organizationId to pass to leaveOrganization
   * @returns CreateOrJoinOrganizationResponse
   */
  public leaveOrganization(organizationId: string): Fetch<CreateOrJoinOrganizationResponse> {
    return new LeaveOrganizationMutation(this._request).fetch(organizationId);
  }
  /**
   * Mutation milestoneCreate for MilestonePayload
   *
   * @param input - required input to pass to milestoneCreate
   * @returns MilestonePayload
   */
  public milestoneCreate(input: L.MilestoneCreateInput): Fetch<MilestonePayload> {
    return new MilestoneCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation milestoneDelete for ArchivePayload
   *
   * @param id - required id to pass to milestoneDelete
   * @returns ArchivePayload
   */
  public milestoneDelete(id: string): Fetch<ArchivePayload> {
    return new MilestoneDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation milestoneUpdate for MilestonePayload
   *
   * @param id - required id to pass to milestoneUpdate
   * @param input - required input to pass to milestoneUpdate
   * @returns MilestonePayload
   */
  public milestoneUpdate(id: string, input: L.MilestoneUpdateInput): Fetch<MilestonePayload> {
    return new MilestoneUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation notificationArchive for ArchivePayload
   *
   * @param id - required id to pass to notificationArchive
   * @returns ArchivePayload
   */
  public notificationArchive(id: string): Fetch<ArchivePayload> {
    return new NotificationArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation notificationCreate for NotificationPayload
   *
   * @param id - required id to pass to notificationCreate
   * @param input - required input to pass to notificationCreate
   * @returns NotificationPayload
   */
  public notificationCreate(id: string, input: L.NotificationUpdateInput): Fetch<NotificationPayload> {
    return new NotificationCreateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation notificationDelete for ArchivePayload
   *
   * @param id - required id to pass to notificationDelete
   * @returns ArchivePayload
   */
  public notificationDelete(id: string): Fetch<ArchivePayload> {
    return new NotificationDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation notificationSubscriptionCreate for NotificationSubscriptionPayload
   *
   * @param input - required input to pass to notificationSubscriptionCreate
   * @returns NotificationSubscriptionPayload
   */
  public notificationSubscriptionCreate(
    input: L.NotificationSubscriptionCreateInput
  ): Fetch<NotificationSubscriptionPayload> {
    return new NotificationSubscriptionCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation notificationSubscriptionDelete for ArchivePayload
   *
   * @param id - required id to pass to notificationSubscriptionDelete
   * @returns ArchivePayload
   */
  public notificationSubscriptionDelete(id: string): Fetch<ArchivePayload> {
    return new NotificationSubscriptionDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation notificationUnarchive for ArchivePayload
   *
   * @param id - required id to pass to notificationUnarchive
   * @returns ArchivePayload
   */
  public notificationUnarchive(id: string): Fetch<ArchivePayload> {
    return new NotificationUnarchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation notificationUpdate for NotificationPayload
   *
   * @param id - required id to pass to notificationUpdate
   * @param input - required input to pass to notificationUpdate
   * @returns NotificationPayload
   */
  public notificationUpdate(id: string, input: L.NotificationUpdateInput): Fetch<NotificationPayload> {
    return new NotificationUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation oauthClientArchive for ArchivePayload
   *
   * @param id - required id to pass to oauthClientArchive
   * @returns ArchivePayload
   */
  public oauthClientArchive(id: string): Fetch<ArchivePayload> {
    return new OauthClientArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation oauthClientCreate for OauthClientPayload
   *
   * @param input - required input to pass to oauthClientCreate
   * @returns OauthClientPayload
   */
  public oauthClientCreate(input: L.OauthClientCreateInput): Fetch<OauthClientPayload> {
    return new OauthClientCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation oauthClientRotateSecret for RotateSecretPayload
   *
   * @param id - required id to pass to oauthClientRotateSecret
   * @returns RotateSecretPayload
   */
  public oauthClientRotateSecret(id: string): Fetch<RotateSecretPayload> {
    return new OauthClientRotateSecretMutation(this._request).fetch(id);
  }
  /**
   * Mutation oauthClientUpdate for OauthClientPayload
   *
   * @param id - required id to pass to oauthClientUpdate
   * @param input - required input to pass to oauthClientUpdate
   * @returns OauthClientPayload
   */
  public oauthClientUpdate(id: string, input: L.OauthClientUpdateInput): Fetch<OauthClientPayload> {
    return new OauthClientUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation oauthTokenRevoke for OauthTokenRevokePayload
   *
   * @param appId - required appId to pass to oauthTokenRevoke
   * @param scope - required scope to pass to oauthTokenRevoke
   * @returns OauthTokenRevokePayload
   */
  public oauthTokenRevoke(appId: string, scope: string[]): Fetch<OauthTokenRevokePayload> {
    return new OauthTokenRevokeMutation(this._request).fetch(appId, scope);
  }
  /**
   * Mutation organizationDelete for OrganizationDeletePayload
   *
   * @param input - required input to pass to organizationDelete
   * @returns OrganizationDeletePayload
   */
  public organizationDelete(input: L.DeleteOrganizationInput): Fetch<OrganizationDeletePayload> {
    return new OrganizationDeleteMutation(this._request).fetch(input);
  }
  /**
   * Mutation organizationDeleteChallenge for OrganizationDeletePayload
   *
   * @returns OrganizationDeletePayload
   */
  public get organizationDeleteChallenge(): Fetch<OrganizationDeletePayload> {
    return new OrganizationDeleteChallengeMutation(this._request).fetch();
  }
  /**
   * Mutation organizationDomainCreate for OrganizationDomainPayload
   *
   * @param input - required input to pass to organizationDomainCreate
   * @returns OrganizationDomainPayload
   */
  public organizationDomainCreate(input: L.OrganizationDomainCreateInput): Fetch<OrganizationDomainPayload> {
    return new OrganizationDomainCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation organizationDomainDelete for ArchivePayload
   *
   * @param id - required id to pass to organizationDomainDelete
   * @returns ArchivePayload
   */
  public organizationDomainDelete(id: string): Fetch<ArchivePayload> {
    return new OrganizationDomainDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation organizationDomainVerify for OrganizationDomainPayload
   *
   * @param input - required input to pass to organizationDomainVerify
   * @returns OrganizationDomainPayload
   */
  public organizationDomainVerify(input: L.OrganizationDomainVerificationInput): Fetch<OrganizationDomainPayload> {
    return new OrganizationDomainVerifyMutation(this._request).fetch(input);
  }
  /**
   * Mutation organizationInviteCreate for OrganizationInvitePayload
   *
   * @param input - required input to pass to organizationInviteCreate
   * @returns OrganizationInvitePayload
   */
  public organizationInviteCreate(input: L.OrganizationInviteCreateInput): Fetch<OrganizationInvitePayload> {
    return new OrganizationInviteCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation organizationInviteDelete for ArchivePayload
   *
   * @param id - required id to pass to organizationInviteDelete
   * @returns ArchivePayload
   */
  public organizationInviteDelete(id: string): Fetch<ArchivePayload> {
    return new OrganizationInviteDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation organizationUpdate for OrganizationPayload
   *
   * @param input - required input to pass to organizationUpdate
   * @returns OrganizationPayload
   */
  public organizationUpdate(input: L.UpdateOrganizationInput): Fetch<OrganizationPayload> {
    return new OrganizationUpdateMutation(this._request).fetch(input);
  }
  /**
   * Mutation projectArchive for ArchivePayload
   *
   * @param id - required id to pass to projectArchive
   * @returns ArchivePayload
   */
  public projectArchive(id: string): Fetch<ArchivePayload> {
    return new ProjectArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation projectCreate for ProjectPayload
   *
   * @param input - required input to pass to projectCreate
   * @returns ProjectPayload
   */
  public projectCreate(input: L.ProjectCreateInput): Fetch<ProjectPayload> {
    return new ProjectCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation projectLinkCreate for ProjectLinkPayload
   *
   * @param input - required input to pass to projectLinkCreate
   * @returns ProjectLinkPayload
   */
  public projectLinkCreate(input: L.ProjectLinkCreateInput): Fetch<ProjectLinkPayload> {
    return new ProjectLinkCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation projectLinkDelete for ArchivePayload
   *
   * @param id - required id to pass to projectLinkDelete
   * @returns ArchivePayload
   */
  public projectLinkDelete(id: string): Fetch<ArchivePayload> {
    return new ProjectLinkDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation projectUpdate for ProjectPayload
   *
   * @param id - required id to pass to projectUpdate
   * @param input - required input to pass to projectUpdate
   * @returns ProjectPayload
   */
  public projectUpdate(id: string, input: L.ProjectUpdateInput): Fetch<ProjectPayload> {
    return new ProjectUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation pushSubscriptionCreate for PushSubscriptionPayload
   *
   * @param input - required input to pass to pushSubscriptionCreate
   * @returns PushSubscriptionPayload
   */
  public pushSubscriptionCreate(input: L.PushSubscriptionCreateInput): Fetch<PushSubscriptionPayload> {
    return new PushSubscriptionCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation pushSubscriptionDelete for PushSubscriptionPayload
   *
   * @param id - required id to pass to pushSubscriptionDelete
   * @returns PushSubscriptionPayload
   */
  public pushSubscriptionDelete(id: string): Fetch<PushSubscriptionPayload> {
    return new PushSubscriptionDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation reactionCreate for ReactionPayload
   *
   * @param input - required input to pass to reactionCreate
   * @returns ReactionPayload
   */
  public reactionCreate(input: L.ReactionCreateInput): Fetch<ReactionPayload> {
    return new ReactionCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation reactionDelete for ArchivePayload
   *
   * @param id - required id to pass to reactionDelete
   * @returns ArchivePayload
   */
  public reactionDelete(id: string): Fetch<ArchivePayload> {
    return new ReactionDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation refreshGoogleSheetsData for IntegrationPayload
   *
   * @param id - required id to pass to refreshGoogleSheetsData
   * @returns IntegrationPayload
   */
  public refreshGoogleSheetsData(id: string): Fetch<IntegrationPayload> {
    return new RefreshGoogleSheetsDataMutation(this._request).fetch(id);
  }
  /**
   * Mutation resentOrganizationInvite for ArchivePayload
   *
   * @param id - required id to pass to resentOrganizationInvite
   * @returns ArchivePayload
   */
  public resentOrganizationInvite(id: string): Fetch<ArchivePayload> {
    return new ResentOrganizationInviteMutation(this._request).fetch(id);
  }
  /**
   * Mutation samlTokenUserAccountAuth for AuthResolverResponse
   *
   * @param input - required input to pass to samlTokenUserAccountAuth
   * @returns AuthResolverResponse
   */
  public samlTokenUserAccountAuth(input: L.TokenUserAccountAuthInput): Fetch<AuthResolverResponse> {
    return new SamlTokenUserAccountAuthMutation(this._request).fetch(input);
  }
  /**
   * Mutation subscriptionArchive for ArchivePayload
   *
   * @param id - required id to pass to subscriptionArchive
   * @returns ArchivePayload
   */
  public subscriptionArchive(id: string): Fetch<ArchivePayload> {
    return new SubscriptionArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation subscriptionSessionCreate for SubscriptionSessionPayload
   *
   * @param plan - required plan to pass to subscriptionSessionCreate
   * @returns SubscriptionSessionPayload
   */
  public subscriptionSessionCreate(plan: string): Fetch<SubscriptionSessionPayload> {
    return new SubscriptionSessionCreateMutation(this._request).fetch(plan);
  }
  /**
   * Mutation subscriptionUpdate for SubscriptionPayload
   *
   * @param id - required id to pass to subscriptionUpdate
   * @param input - required input to pass to subscriptionUpdate
   * @returns SubscriptionPayload
   */
  public subscriptionUpdate(id: string, input: L.SubscriptionUpdateInput): Fetch<SubscriptionPayload> {
    return new SubscriptionUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation subscriptionUpdateSessionCreate for SubscriptionSessionPayload
   *
   * @returns SubscriptionSessionPayload
   */
  public get subscriptionUpdateSessionCreate(): Fetch<SubscriptionSessionPayload> {
    return new SubscriptionUpdateSessionCreateMutation(this._request).fetch();
  }
  /**
   * Mutation subscriptionUpgrade for SubscriptionPayload
   *
   * @param id - required id to pass to subscriptionUpgrade
   * @param type - required type to pass to subscriptionUpgrade
   * @returns SubscriptionPayload
   */
  public subscriptionUpgrade(id: string, type: string): Fetch<SubscriptionPayload> {
    return new SubscriptionUpgradeMutation(this._request).fetch(id, type);
  }
  /**
   * Mutation teamArchive for ArchivePayload
   *
   * @param id - required id to pass to teamArchive
   * @returns ArchivePayload
   */
  public teamArchive(id: string): Fetch<ArchivePayload> {
    return new TeamArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation teamCreate for TeamPayload
   *
   * @param input - required input to pass to teamCreate
   * @param variables - variables without 'input' to pass into the TeamCreateMutation
   * @returns TeamPayload
   */
  public teamCreate(
    input: L.TeamCreateInput,
    variables?: Omit<L.TeamCreateMutationVariables, "input">
  ): Fetch<TeamPayload> {
    return new TeamCreateMutation(this._request).fetch(input, variables);
  }
  /**
   * Mutation teamDelete for ArchivePayload
   *
   * @param id - required id to pass to teamDelete
   * @returns ArchivePayload
   */
  public teamDelete(id: string): Fetch<ArchivePayload> {
    return new TeamDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation teamMembershipCreate for TeamMembershipPayload
   *
   * @param input - required input to pass to teamMembershipCreate
   * @returns TeamMembershipPayload
   */
  public teamMembershipCreate(input: L.TeamMembershipCreateInput): Fetch<TeamMembershipPayload> {
    return new TeamMembershipCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation teamMembershipDelete for ArchivePayload
   *
   * @param id - required id to pass to teamMembershipDelete
   * @returns ArchivePayload
   */
  public teamMembershipDelete(id: string): Fetch<ArchivePayload> {
    return new TeamMembershipDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation teamUpdate for TeamPayload
   *
   * @param id - required id to pass to teamUpdate
   * @param input - required input to pass to teamUpdate
   * @returns TeamPayload
   */
  public teamUpdate(id: string, input: L.TeamUpdateInput): Fetch<TeamPayload> {
    return new TeamUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation templateCreate for TemplatePayload
   *
   * @param input - required input to pass to templateCreate
   * @returns TemplatePayload
   */
  public templateCreate(input: L.TemplateCreateInput): Fetch<TemplatePayload> {
    return new TemplateCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation templateDelete for ArchivePayload
   *
   * @param id - required id to pass to templateDelete
   * @returns ArchivePayload
   */
  public templateDelete(id: string): Fetch<ArchivePayload> {
    return new TemplateDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation templateUpdate for TemplatePayload
   *
   * @param id - required id to pass to templateUpdate
   * @param input - required input to pass to templateUpdate
   * @returns TemplatePayload
   */
  public templateUpdate(id: string, input: L.TemplateUpdateInput): Fetch<TemplatePayload> {
    return new TemplateUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation userDemoteAdmin for UserAdminPayload
   *
   * @param id - required id to pass to userDemoteAdmin
   * @returns UserAdminPayload
   */
  public userDemoteAdmin(id: string): Fetch<UserAdminPayload> {
    return new UserDemoteAdminMutation(this._request).fetch(id);
  }
  /**
   * Mutation userFlagUpdate for UserSettingsFlagPayload
   *
   * @param flag - required flag to pass to userFlagUpdate
   * @param operation - required operation to pass to userFlagUpdate
   * @returns UserSettingsFlagPayload
   */
  public userFlagUpdate(flag: L.UserFlagType, operation: L.UserFlagUpdateOperation): Fetch<UserSettingsFlagPayload> {
    return new UserFlagUpdateMutation(this._request).fetch(flag, operation);
  }
  /**
   * Mutation userPromoteAdmin for UserAdminPayload
   *
   * @param id - required id to pass to userPromoteAdmin
   * @returns UserAdminPayload
   */
  public userPromoteAdmin(id: string): Fetch<UserAdminPayload> {
    return new UserPromoteAdminMutation(this._request).fetch(id);
  }
  /**
   * Mutation userSettingsFlagIncrement for UserSettingsFlagPayload
   *
   * @param flag - required flag to pass to userSettingsFlagIncrement
   * @returns UserSettingsFlagPayload
   */
  public userSettingsFlagIncrement(flag: string): Fetch<UserSettingsFlagPayload> {
    return new UserSettingsFlagIncrementMutation(this._request).fetch(flag);
  }
  /**
   * Mutation userSettingsFlagsReset for UserSettingsFlagsResetPayload
   *
   * @returns UserSettingsFlagsResetPayload
   */
  public get userSettingsFlagsReset(): Fetch<UserSettingsFlagsResetPayload> {
    return new UserSettingsFlagsResetMutation(this._request).fetch();
  }
  /**
   * Mutation userSettingsUpdate for UserSettingsPayload
   *
   * @param id - required id to pass to userSettingsUpdate
   * @param input - required input to pass to userSettingsUpdate
   * @returns UserSettingsPayload
   */
  public userSettingsUpdate(id: string, input: L.UserSettingsUpdateInput): Fetch<UserSettingsPayload> {
    return new UserSettingsUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation userSubscribeToNewsletter for UserSubscribeToNewsletterPayload
   *
   * @returns UserSubscribeToNewsletterPayload
   */
  public get userSubscribeToNewsletter(): Fetch<UserSubscribeToNewsletterPayload> {
    return new UserSubscribeToNewsletterMutation(this._request).fetch();
  }
  /**
   * Mutation userSuspend for UserAdminPayload
   *
   * @param id - required id to pass to userSuspend
   * @returns UserAdminPayload
   */
  public userSuspend(id: string): Fetch<UserAdminPayload> {
    return new UserSuspendMutation(this._request).fetch(id);
  }
  /**
   * Mutation userUnsuspend for UserAdminPayload
   *
   * @param id - required id to pass to userUnsuspend
   * @returns UserAdminPayload
   */
  public userUnsuspend(id: string): Fetch<UserAdminPayload> {
    return new UserUnsuspendMutation(this._request).fetch(id);
  }
  /**
   * Mutation userUpdate for UserPayload
   *
   * @param id - required id to pass to userUpdate
   * @param input - required input to pass to userUpdate
   * @returns UserPayload
   */
  public userUpdate(id: string, input: L.UpdateUserInput): Fetch<UserPayload> {
    return new UserUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation viewPreferencesCreate for ViewPreferencesPayload
   *
   * @param input - required input to pass to viewPreferencesCreate
   * @returns ViewPreferencesPayload
   */
  public viewPreferencesCreate(input: L.ViewPreferencesCreateInput): Fetch<ViewPreferencesPayload> {
    return new ViewPreferencesCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation viewPreferencesDelete for ArchivePayload
   *
   * @param id - required id to pass to viewPreferencesDelete
   * @returns ArchivePayload
   */
  public viewPreferencesDelete(id: string): Fetch<ArchivePayload> {
    return new ViewPreferencesDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation viewPreferencesUpdate for ViewPreferencesPayload
   *
   * @param id - required id to pass to viewPreferencesUpdate
   * @param input - required input to pass to viewPreferencesUpdate
   * @returns ViewPreferencesPayload
   */
  public viewPreferencesUpdate(id: string, input: L.ViewPreferencesUpdateInput): Fetch<ViewPreferencesPayload> {
    return new ViewPreferencesUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation webhookCreate for WebhookPayload
   *
   * @param input - required input to pass to webhookCreate
   * @returns WebhookPayload
   */
  public webhookCreate(input: L.WebhookCreateInput): Fetch<WebhookPayload> {
    return new WebhookCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation webhookDelete for ArchivePayload
   *
   * @param id - required id to pass to webhookDelete
   * @returns ArchivePayload
   */
  public webhookDelete(id: string): Fetch<ArchivePayload> {
    return new WebhookDeleteMutation(this._request).fetch(id);
  }
  /**
   * Mutation webhookUpdate for WebhookPayload
   *
   * @param id - required id to pass to webhookUpdate
   * @param input - required input to pass to webhookUpdate
   * @returns WebhookPayload
   */
  public webhookUpdate(id: string, input: L.WebhookUpdateInput): Fetch<WebhookPayload> {
    return new WebhookUpdateMutation(this._request).fetch(id, input);
  }
  /**
   * Mutation workflowStateArchive for ArchivePayload
   *
   * @param id - required id to pass to workflowStateArchive
   * @returns ArchivePayload
   */
  public workflowStateArchive(id: string): Fetch<ArchivePayload> {
    return new WorkflowStateArchiveMutation(this._request).fetch(id);
  }
  /**
   * Mutation workflowStateCreate for WorkflowStatePayload
   *
   * @param input - required input to pass to workflowStateCreate
   * @returns WorkflowStatePayload
   */
  public workflowStateCreate(input: L.WorkflowStateCreateInput): Fetch<WorkflowStatePayload> {
    return new WorkflowStateCreateMutation(this._request).fetch(input);
  }
  /**
   * Mutation workflowStateUpdate for WorkflowStatePayload
   *
   * @param id - required id to pass to workflowStateUpdate
   * @param input - required input to pass to workflowStateUpdate
   * @returns WorkflowStatePayload
   */
  public workflowStateUpdate(id: string, input: L.WorkflowStateUpdateInput): Fetch<WorkflowStatePayload> {
    return new WorkflowStateUpdateMutation(this._request).fetch(id, input);
  }
}