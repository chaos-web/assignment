

  export interface IDeviceTrackingData {
    [deviceId: string]: {
      data: Array<[
        time: number,
        [latitude: number, longitude: number, speed: number]
      ]>;
      time: number; // milliseconds
    };
  }


