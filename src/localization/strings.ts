import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  generic: {
    loading: string;
    cancel: string;
    confirm: string;
  };

  form: {
    tableField: {
      addNewRow: string;
    };
  };

  formScreen: {
    saveDraft: string;
    saveDraftLink: string;
    draftSaved: string;
    draftEmailText: string;
    draftEmailLink: string;
    draftEmailDialogText: string;
    draftEmailContent: string;
    draftEmailSubject: string;
    draftEmailSent: string;
    savingReply: string;
    replySaved: string;
    replyEdit: string;
    replyEditEmailText: string;
    replyEditEmailLink: string;
    replyEditEmailDialogText: string;
    replyEditEmailContent: string;
    replyEditEmailSubject: string;
    replyEditEmailSent: string;
    replyDeleteText: string;
    replyDeleteLink: string;
    confirmDeleteReplyTitle: string;
    confirmDeleteReplyText: string;
    replyDeleted: string;
  };

  adminScreen: {
    title: string;
    filterLabel: string;
    filterShowAll: string;
    exportXlsx: string;
    openReply: string;
    deleteReply: string;
    confirmDeleteReplyTitle: string;
    confirmDeleteReplyText: string;
  };

  adminReplyScreen: {
    title: string;
    exportPdf: string;
    savingReply: string;
    replySaved: string;
  };

  adminLayout: {
    replies: string;
    profile: string;
    logout: string;
  },

  emailDialog: {
    title: string;
    email: string;
    cancel: string;
    send: string;
  },

  errorDialog: {
    title: string;
    reloadPage: string;
    unsavedContents: string;
    reportIssue: string;
    technicalDetails: string;
    time: string;
    url: string;
    errorMessage: string;
    close: string;
    reload: string;
  };

}

/**
 * Localized strings instance
 */
const strings: IStrings = new LocalizedStrings({
  en: require("./en.json"),
  fi: require("./fi.json")
});

export default strings;
