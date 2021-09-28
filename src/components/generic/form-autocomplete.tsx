import * as React from "react";

import { Autocomplete } from '@material-ui/lab';
import { CircularProgress, TextField, Typography, WithStyles } from "@material-ui/core";
import CodeServerClient from "../../codeserver/client";
import { Metaform, MetaformField, MetaformFieldAutocompleteService, MetaformFieldSourceType } from "../../generated/client";
import { Attribute, Qfield } from "../../generated/codeserver-client";
import { FieldValue } from "metaform-react";
import Config from "../../config";
import strings from "../../localization/strings";
import styles from "../../styles/form";
import { autocompleteErrorMessages, AutocompleteItem } from "../../types";

/**
 * Interface representing component properties
 */
interface Props extends WithStyles<typeof styles> {
  minSearchLength: number;
  searchInterval: number;
  metaform: Metaform;
  field: MetaformField;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
}

/**
 * Interface representing component state
 */
interface State {
  loading: boolean;
  items: AutocompleteItem[];
  errorMessage: string;
}

/**
 * React component displaying form autocomplete fields
 */
export default class FormAutocomplete extends React.Component<Props, State> {

  /**
   * Constructor
   * 
   * @param props component properties
   */
  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      items: [],
      errorMessage: ""
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    this.setState({
      loading: true
    });

    try {
      this.setState({
        items: await this.loadItems(),
        loading: false
      });
    } catch (e) {
      this.setState({        
        loading: false,
        errorMessage: e.message
      });
    }
  }

  /** 
   * Component render method
   */
  public render() {
    const { field } = this.props;
    const { items, errorMessage } = this.state;

    if (errorMessage) {
      return this.renderErrorMessage();
    }

    if (!items && !errorMessage) {
      return this.renderLoader();
    }

    return (
      <Autocomplete<AutocompleteItem>
        id={ field.name }
        options={ items }
        getOptionLabel={ this.getAutocompleteOptionLabel }
        onChange={ this.onAutocompleteChange }
        renderInput={(params) => <TextField {...params} variant="outlined" InputProps={{ ...params.InputProps }}/> }
      />  
    );
  }

  /**
   * Renders loader
   */
  private renderLoader = () => {
    const { classes } = this.props;

    return (
      <div className={ classes.autoCompleteLoader }>        
        <CircularProgress size={ 20 }></CircularProgress>
        <Typography>{ strings.generic.loadingAutoCompleteOptions }</Typography>
      </div>
    );
  }

  /**
   * Renders autocomplete error message
   */
  private renderErrorMessage = () => {
    const { errorMessage } = this.state;

    return (
      <div style={{paddingLeft:"10px"}}>
        <Typography style={{fontSize:"0.6rem"}} variant="caption" color="error">{ errorMessage }</Typography>
      </div>
    );
  }

  /**
   * Loads autocomplete items
   * 
   * @returns autocomplete items
   */
  private loadItems = async () => {
    const { field } = this.props;
    const { autocomplete } = field;
    
    if (!autocomplete) {
      throw new Error("Autocomplete not configured");
    }

    switch (autocomplete.service) {
      case MetaformFieldAutocompleteService.CodeServerConceptCode:
        return await this.loadCodeServerConceptCodeItems();
    }
  }

  /**
   * Loads autocomplete items for code server concept code service
   * 
   * @returns autocomplete items for code server concept code service
   */
  private loadCodeServerConceptCodeItems = async () => {
    const { field } = this.props;
    const { autocomplete } = field;

    if (!autocomplete) {
      this.setState({
        errorMessage: autocompleteErrorMessages.MISSING_AUTO_COMPLETE
      });
    }

    const options = autocomplete?.options;
    
    if (!options) {
      throw new Error(autocompleteErrorMessages.MISSING_OPTIONS);
    }

    const { codeServerBaseUrl, codeServerClassificationId, codeServerParentConceptCodeId } = options;
    if (!codeServerBaseUrl) {
      throw new Error(autocompleteErrorMessages.MISSING_CODE_SERVER_BASE_URL);
    }

    if (!codeServerClassificationId) {
      throw new Error(autocompleteErrorMessages.MISSING_CODE_SERVER_CLASSIFICATION_ID);
    }

    if (!codeServerParentConceptCodeId) {
      throw new Error(autocompleteErrorMessages.MISSING_CODE_SERVER_PARENT_CONCEPT_CODE_ID);
    }

    const corsProxy = Config.getCorsProxy();
    const conceptCodeApi = CodeServerClient.getConceptCodeApi(`${corsProxy}/${codeServerBaseUrl}`);
    
    const conceptCodes = await conceptCodeApi.getConceptCodesFromDefaultVersion({
      classificationId: codeServerClassificationId,
      qfield: [ Qfield.PARENTID ],
      qvalue: codeServerParentConceptCodeId
    });
    
    const items: AutocompleteItem[] = (conceptCodes.conceptCodes || []).map(conceptCodes => {
      return (conceptCodes.attributes || [])
        .filter((attribute) => attribute.attributeName && attribute.attributeValue)
        .reduce((mapped: { [key: string]: string }, attribute: Attribute) => {
          const key = attribute.attributeName!!;
          const value = (attribute.attributeValue || []).join(",");
          mapped[key] = value;
          return mapped;
        }, { id: conceptCodes.classificationId!! }) as AutocompleteItem;
    });

    return items;
  }  

  /**
   * Returns label for autocomplete item
   * 
   * @param autocompleteItem autocomplete item
   * @returns label
   */
  private getAutocompleteOptionLabel = (autocompleteItem: AutocompleteItem) => {
    const { field } = this.props;
    const { autocomplete } = field;

    if (!autocomplete) {
      return "Unknown";
    }

    switch (autocomplete.service) {
      case MetaformFieldAutocompleteService.CodeServerConceptCode:
        return autocompleteItem["Abbreviation"];
    }
  }

  /**
   * Returns fields that use this autocomplete field as source
   * 
   * @returns fields that use this autocomplete field as source
   */
  private getSourceFields = () => {
    const { metaform, field } = this.props;

    return (metaform.sections || [])
      .flatMap(section => section.fields || [])
      .filter(sourceField => sourceField.source?.type === MetaformFieldSourceType.Autocomplete)
      .filter(sourceField => sourceField.source?.options?.autocompleteField === field.name);
  }

  /**
   * Event handler for autocomplete change
   * 
   * @param _event event
   * @param value new value
   */
  private onAutocompleteChange = (_event: React.ChangeEvent<{}>, value: AutocompleteItem | null) => {
    const { setFieldValue, field } = this.props;

    if (field.name) {
      setFieldValue(field.name, value?.id || null);
    }
    
    this.getSourceFields().forEach(sourceField => {
      if (sourceField.name) {
        const itemProperty = sourceField.source?.options?.autocompleteItemProperty;
        const itemValue = itemProperty && value ? value[itemProperty] : null;
        setFieldValue(sourceField.name, itemValue);
      }
    });
  }

}
