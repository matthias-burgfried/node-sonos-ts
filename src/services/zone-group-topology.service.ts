// Automatically generated by service-generator.js, don't change!
import BaseService from './base-service';

/**
 * Zone config stuff, eg getting all the configured sonos zones.
 *
 * @export
 * @class ZoneGroupTopologyServiceBase
 * @extends {BaseService}
 */
export class ZoneGroupTopologyServiceBase extends BaseService<ZoneGroupTopologyServiceEvent> {
  readonly serviceNane: string = 'ZoneGroupTopology';

  readonly controlUrl: string = '/ZoneGroupTopology/Control';

  readonly eventSubUrl: string = '/ZoneGroupTopology/Event';

  readonly scpUrl: string = '/xml/ZoneGroupTopology1.xml';

  // #region methods
  async BeginSoftwareUpdate(input: { UpdateURL: string; Flags: number; ExtraOptions: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('BeginSoftwareUpdate', input); }

  async CheckForUpdate(input: { UpdateType: string; CachedOnly: boolean; Version: string }):
  Promise<CheckForUpdateResponse> { return await this.SoapRequestWithBody<typeof input, CheckForUpdateResponse>('CheckForUpdate', input); }

  /**
   * Get information about the current Zone
   */
  async GetZoneGroupAttributes():
  Promise<GetZoneGroupAttributesResponse> { return await this.SoapRequest<GetZoneGroupAttributesResponse>('GetZoneGroupAttributes'); }

  /**
   * Get all the Sonos groups, (as XML), see GetParsedZoneGroupState
   */
  async GetZoneGroupState():
  Promise<GetZoneGroupStateResponse> { return await this.SoapRequest<GetZoneGroupStateResponse>('GetZoneGroupState'); }

  async RegisterMobileDevice(input: { MobileDeviceName: string; MobileDeviceUDN: string; MobileIPAndPort: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('RegisterMobileDevice', input); }

  async ReportAlarmStartedRunning():
  Promise<boolean> { return await this.SoapRequestNoResponse('ReportAlarmStartedRunning'); }

  async ReportUnresponsiveDevice(input: { DeviceUUID: string; DesiredAction: string }):
  Promise<boolean> { return await this.SoapRequestWithBodyNoResponse<typeof input>('ReportUnresponsiveDevice', input); }

  async SubmitDiagnostics(input: { IncludeControllers: boolean; Type: string }):
  Promise<SubmitDiagnosticsResponse> { return await this.SoapRequestWithBody<typeof input, SubmitDiagnosticsResponse>('SubmitDiagnostics', input); }
  // #endregion

  // Event properties from service description.
  protected eventProperties(): {[key: string]: string} {
    return {
      AlarmRunSequence: 'string',
      AreasUpdateID: 'string',
      AvailableSoftwareUpdate: 'any',
      DiagnosticID: 'number',
      MuseHouseholdId: 'string',
      NetsettingsUpdateID: 'string',
      SourceAreasUpdateID: 'string',
      ThirdPartyMediaServersX: 'string',
      ZoneGroupID: 'string',
      ZoneGroupName: 'string',
      ZoneGroupState: 'Array<ZoneGroup>',
      ZonePlayerUUIDsInGroup: 'string',
    };
  }
}

// Generated responses
export interface CheckForUpdateResponse {
  UpdateItem: string;
}

export interface GetZoneGroupAttributesResponse {
  CurrentZoneGroupName: string;
  CurrentZoneGroupID: string;
  CurrentZonePlayerUUIDsInGroup: string;
  CurrentMuseHouseholdId: string;
}

export interface GetZoneGroupStateResponse {
  ZoneGroupState: string;
}

export interface SubmitDiagnosticsResponse {
  DiagnosticID: number;
}

// Strong type event
export interface ZoneGroupTopologyServiceEvent {
  AlarmRunSequence?: string;
  AreasUpdateID?: string;
  AvailableSoftwareUpdate?: any;
  DiagnosticID?: number;
  MuseHouseholdId?: string;
  NetsettingsUpdateID?: string;
  SourceAreasUpdateID?: string;
  ThirdPartyMediaServersX?: string;
  ZoneGroupID?: string;
  ZoneGroupName?: string;
  ZoneGroupState?: Array<ZoneGroup>;
  ZonePlayerUUIDsInGroup?: string;
}

export interface ZoneGroup {
  name: string;
  coordinator: ZoneMember;
  members: ZoneMember[];
}

interface ZoneMember {
  host: string;
  port: number;
  uuid: string;
  name: string;
  Icon: string;
  MicEnabled: boolean;
  SoftwareVersion: string;
  SwGen: string;
}

import { URL } from 'url';
import XmlHelper from '../helpers/xml-helper';
import ArrayHelper from '../helpers/array-helper';

/**
 * Zone config stuff, eg getting all the configured sonos zones.
 *
 * @export
 * @class ZoneGroupTopologyService
 * @extends {ZoneGroupTopologyServiceBase}
 */
export class ZoneGroupTopologyService extends ZoneGroupTopologyServiceBase {
  /**
   * Get all the sonos groups in your current network. Parsed the GetZoneGroupState output.
   *
   * @returns {Promise<ZoneGroup[]>}
   * @memberof ZoneGroupTopologyService
   */
  async GetParsedZoneGroupState(): Promise<ZoneGroup[]> {
    const groupStateResponse = await this.GetZoneGroupState();
    const decodedGroupState = XmlHelper.DecodeAndParseXml(groupStateResponse.ZoneGroupState, '');
    const groups = ArrayHelper.ForceArray(decodedGroupState.ZoneGroupState.ZoneGroups.ZoneGroup);
    return groups.map((g: any) => ZoneGroupTopologyService.ParseGroup(g));
  }

  private static ParseMember(member: any): ZoneMember {
    const uri = new URL(member.Location);
    return {
      name: member.ZoneName,
      uuid: member.UUID,
      host: uri.hostname,
      port: parseInt(uri.port, 10),
      Icon: member.Icon,
      MicEnabled: member.MicEnabled === 1,
      SoftwareVersion: member.SoftwareVersion,
      SwGen: member.SWGen,
    };
  }

  private static ParseGroup(group: any): ZoneGroup {
    const members: ZoneMember[] = ArrayHelper.ForceArray(group.ZoneGroupMember).map((m: any) => ZoneGroupTopologyService.ParseMember(m));
    const coordinator: ZoneMember | undefined = members.find((m) => m.uuid === group.Coordinator);

    if (coordinator === undefined) throw new Error('Error parsing ZoneGroup');

    let { name } = coordinator;
    if (members.length > 1) name += ` + ${members.length - 1}`;

    return {
      name,
      coordinator,
      members,
    };
  }

  protected ResolveEventPropertyValue(name: string, originalValue: any, type: string): any {
    const parsedValue = super.ResolveEventPropertyValue(name, originalValue, type);
    if (name === 'ZoneGroupState') {
      const groups = ArrayHelper.ForceArray(parsedValue.ZoneGroupState.ZoneGroups.ZoneGroup);
      return groups.map((g: any) => ZoneGroupTopologyService.ParseGroup(g));
    }

    return parsedValue;
  }
}