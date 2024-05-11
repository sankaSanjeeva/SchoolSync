export enum Role {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
}

export enum Tab {
  ALL = 'all',
  PRIVATE = ChatType.PRIVATE,
  GROUP = ChatType.GROUP,
}

export enum MsgStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  DELETED = 'deleted',
}
