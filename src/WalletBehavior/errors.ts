export class ApiError extends Error {
    public code:number;
    constructor(param:{code:number,message:string}){
        super(param.message);
        this.code=param.code;
    }
}

export const NOT_ERC20= {
    code: 111 as const,
    message: 'An error occurred (NOT_ERC20)' as const,
  }
  
  export const UNLISTED_NETWORK= {
    code: 112 as const,
    message: 'An error occurred (UNLISTED_NETWORK)' as const,
  }
  
  export const USER_REFUSED_OP= {
    code: 113 as const,
    message: 'An error occurred (USER_REFUSED_OP)' as const,
  }
  
  export const INVALID_REQUEST_PAYLOAD= {
    code: 114 as const,
    message: 'An error occurred (INVALID_REQUEST_PAYLOAD)' as const,
  }
  
  export interface ACCOUNT_ALREADY_DEPLOYED {
    code: 115;
    message: 'An error occurred (ACCOUNT_ALREADY_DEPLOYED)';
  }
  
  export const API_VERSION_NOT_SUPPORTED= {
    code: 162 as const,
    message: 'An error occurred (API_VERSION_NOT_SUPPORTED)' as const,
    data: 'string' as const,
  }
  
  export interface UNKNOWN_ERROR {
    code: 163;
    message: 'An error occurred (UNKNOWN_ERROR)';
  }