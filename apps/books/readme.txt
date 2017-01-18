Structure of a JSON request
{
  "session": {
    "sessionId": "SessionId.12345a16-a972-4ea4-843d-1f790ababcde",
    "application": {
      "applicationId": "amzn1.ask.skill.9876540-d96f-4b90-1435-f65e5bc1a667"
    },
    "attributes": {},
    "user": {
      "userId": "amzn1.ask.account.ASNBNDFHGERUEYRGECPW5FNSOHJFN26CK5CGSDA37MM2MSYOWHZRMAU42DQCSFS3LFNP24UYBK54RFGFGFGWHFYYEEQKIUTIS4OD2YMCPHEE74CQLD53ZOIMZDVTA4WRSSVDM3U33L7NKPNLUUQVQREL6EFWM5JB6HUKRWYYGXT44ESL6HTCVK5TGC6EXDFGGJKZ88Z"
    },
    "new": true
}

applicatin id - unique identifieer for your skill.you can use this to validate uniquness
session id- current session identifier .when user says " alexa , start book " a new session id is created.
