interface OrgsItem {
  "name": string;
  "id": string;
  "type": string;
  "parent": string | null;
  "representation": string;
  "members": Array<string>;
  "memberList": Array<MemberItem>;
  "children": Array<OrgsItem>
}

interface MemberItem {
  "name": string
  "id": string
  "age": number | string
  "status": string
}

export { OrgsItem, MemberItem }