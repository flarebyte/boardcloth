export interface KeyValue {
  k: string;
  v: string;
}
export interface KeyMultipleValues {
  k: string;
  v: string[];
}

const singleValue = (k: string, v: string): KeyValue => ({ k, v });
const multipleValues = (k: string, v: string[]): KeyMultipleValues => ({
  k,
  v,
});

export interface BoardclothParams {
  single: KeyValue[];
  multiple: KeyMultipleValues[];
}
export interface BoardclothMessage {
  headers: BoardclothParams;
  params: BoardclothParams;
}

export class MessageCreator {
  private _message: BoardclothMessage = {
    headers: {
      single: [],
      multiple: [],
    },
    params: {
      single: [],
      multiple: [],
    },
  };

  get message() {
    return this._message;
  }

  addHeaderSingle(k: string, v: string) {
    this._message.headers.single.push(singleValue(k, v));
    return this;
  }
  addHeaderMultiple(k: string, v: string[]) {
    this._message.headers.multiple.push(multipleValues(k, v));
    return this;
  }
  addParamSingle(k: string, v: string) {
    this._message.params.single.push(singleValue(k, v));
    return this;
  }
  addParamMultiple(k: string, v: string[]) {
    this._message.params.multiple.push(multipleValues(k, v));
    return this;
  }
}
