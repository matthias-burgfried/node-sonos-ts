// Automatically generated by service-generator.js, don't change!
import BaseService from './base-service';

export class ConnectionManagerService extends BaseService<ConnectionManagerServiceEvent> {
  readonly serviceNane: string = 'ConnectionManager';

  readonly controlUrl: string = '/MediaRenderer/ConnectionManager/Control';

  readonly eventSubUrl: string = '/MediaRenderer/ConnectionManager/Event';

  readonly scpUrl: string = '/xml/ConnectionManager1.xml';

  // #region methods
  async GetCurrentConnectionIDs():
  Promise<GetCurrentConnectionIDsResponse> { return await this.SoapRequest<GetCurrentConnectionIDsResponse>('GetCurrentConnectionIDs'); }

  async GetCurrentConnectionInfo(input: { ConnectionID: number }):
  Promise<GetCurrentConnectionInfoResponse> { return await this.SoapRequestWithBody<typeof input, GetCurrentConnectionInfoResponse>('GetCurrentConnectionInfo', input); }

  async GetProtocolInfo():
  Promise<GetProtocolInfoResponse> { return await this.SoapRequest<GetProtocolInfoResponse>('GetProtocolInfo'); }
  // #endregion

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      CurrentConnectionIDs: 'string',
      SinkProtocolInfo: 'string',
      SourceProtocolInfo: 'string',
    };
  }
}

// Generated responses
export interface GetCurrentConnectionIDsResponse {
  ConnectionIDs: string;
}

export interface GetCurrentConnectionInfoResponse {
  RcsID: number;
  AVTransportID: number;
  ProtocolInfo: string;
  PeerConnectionManager: string;
  PeerConnectionID: number;
  Direction: string;
  Status: string;
}

export interface GetProtocolInfoResponse {
  Source: string;
  Sink: string;
}

// Strong type event
export interface ConnectionManagerServiceEvent {
  CurrentConnectionIDs?: string;
  SinkProtocolInfo?: string;
  SourceProtocolInfo?: string;
}