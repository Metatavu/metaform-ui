import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

  generic: {
    loading: string;
    cancel: string;
    confirm: string;
    loadingAutoCompleteOptions: string;
  };

  form: {
    tableField: {
      addNewRow: string;
    };
    fileField: {
      deleteFileButton: string;
      showFileButton: string;
    };
  };

  formScreen: {
    replyNotFound: string;
    autosaving: string;
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
    logout: string;
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

  adminInviteScreen: {
    title: string;
    emailFieldNotFoundError: string;
    noOwnerKeyError: string;
    sendingInvitation: string;
    invitationEmailSubject: string;
    invitationEmailContent: string;
  };

  adminLayout: {
    replies: string;
    invite: string;
    profile: string;
    logout: string;
  },

  adminLayoutV2: {
    form: string;
    preview: string;
    json: string;
    metaformNavigation: string;
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
  },

  authRedirectDialog: {
    title: string;
    contentTextPt1: string;
    contentTextPt2: string;
    buttonText: string;
  },

  jsonScreen: {
    title: string;
    toggleReadOnlyButtonEdit: string;
    toggleReadOnlyButtonPreview: string;
  },

  formEditScreen: {
    componentsTab: string;
    stylingTab: string;
    formTab: string;
    selectionTab: string;
    emptySection: string;
    addNewSection: string;
    sectionLayout: string;
    textField: string;
    editableTextField: string;
    conditionalField: string;
    dropDownMenu: string;
    selectBox: string;
    radioButton: string;
    button: string;
    image: string;
    unknownFieldType: string;
    formEditorInfo: string;
  },

  editableFields: {
    numberField: string;
    numberFieldMin: string;
    numberFieldMax: string;
  }

  componentTab: {
    label: string;
    html: string;
    text: string;
    radio: string;
    select: string;
    number: string;
    memo: string;
    checkList: string;
    submit: string;
    dateTime: string;
    autocomplete: string;
  },

  formTab: {
    title: string;
    allowAnonymous: string;
    allowDraft: string;
    allowReplyOwnerKey: string;
    allowInvitation: string;
    replayStrategy: string;
  }

}

/**
 * Localized strings instance
 */
const strings: IStrings = new LocalizedStrings({
  en: require("./en.json"),
  fi: require("./fi.json")
});

export default strings;
