import * as React from "react";

import { Autocomplete } from '@material-ui/lab';
import { TextField } from "@material-ui/core";
import CodeServerClient from "../../codeserver/client";
import { Metaform, MetaformField, MetaformFieldAutocompleteService, MetaformFieldSourceType } from "../../generated/client";
import { Attribute, Qfield } from "../../generated/codeserver-client";
import { FieldValue } from "metaform-react";
import Config from "../../config";

/**
 * Autocomplete item
 */
type AutocompleteItem = { id: string, [key: string]: string };

/**
 * Interface representing component properties
 */
interface Props {
  minSearchLength: number;
  searchInterval: number;
  metaform: Metaform;
  field: MetaformField;
  disabled: boolean;
  value: FieldValue;
  onError: (e: Error | string | unknown) => void;
  setFieldValue: (fieldName: string, fieldValue: FieldValue) => void;
}

/**
 * Interface representing component state
 */
interface State {
  loading: boolean;
  items: AutocompleteItem[];
  inputValue: string;
  defaultValue?: AutocompleteItem;
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
      inputValue: ""
    };
  }

  /**
   * Component did mount life cycle event
   */
  public componentDidMount = async () => {
    const { onError, value } = this.props;

    this.setState({
      loading: true
    });

    try {
      const loadedItems = await this.loadItems();
      const defaultAutoCompleteItem = loadedItems.find(item => item.id === value as string);

      console.log("defaultAutoCompleteItem", defaultAutoCompleteItem)
      //TODO set default value for child text field

      this.setState({
        items: loadedItems,
        loading: false,
        defaultValue: defaultAutoCompleteItem ? { ...defaultAutoCompleteItem } : defaultAutoCompleteItem
      });
    } catch (e) {
      this.setState({        
        loading: false
      });

      onError(e);    
    }
    
  }

  /** 
   * Component render method
   */
  public render() {
    const {
      field,
      disabled,
      value,
    } = this.props;

    const {
      items,
      inputValue,
      defaultValue,
      loading
    } = this.state;

    const selectedAutocompleteItem = items.find(item => item.id === value as string);

    console.log("items", items)
    console.log("selectedAutocompleteItem", selectedAutocompleteItem);

    if (loading) {
      return null;
    }

    return (
      <Autocomplete<AutocompleteItem>
        id={ field.name }
        disabled={ disabled }
        options={ items }
        inputValue={ inputValue }
        onInputChange={ this.onAutocompleteInputChange }
        defaultValue={ defaultValue }
        value={ undefined }
        getOptionSelected={ this.getOptionSelected }
        getOptionLabel={ this.getAutocompleteOptionLabel }
        onChange={ this.onAutocompleteChange }
        renderInput={(params) => 
          <TextField 
            {...params}
            InputProps={{ ...params.InputProps }}
          /> 
        }
      />  
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
    
    const options = field.autocomplete?.options;
    
    if (!options) {
      throw new Error("Code server autocomplete not configured");
    }

    const { codeServerBaseUrl, codeServerClassificationId, codeServerParentConceptCodeId } = options;
    if (!codeServerBaseUrl) {
      throw new Error("Code server autocomplete missing codeServerBaseUrl");
    }

    if (!codeServerClassificationId) {
      throw new Error("Code server autocomplete missing codeServerClassificationId");
    }

    if (!codeServerParentConceptCodeId) {
      throw new Error("Code server autocomplete missing codeServerParentConceptCodeId");
    }

    const corsProxy = Config.getCorsProxy();
    const conceptCodeApi = CodeServerClient.getConceptCodeApi(`${corsProxy}/${codeServerBaseUrl}`);
    
    const response = await conceptCodeApi.getConceptCodesFromDefaultVersion({
      classificationId: codeServerClassificationId,
      qfield: [ Qfield.PARENTID ],
      qvalue: codeServerParentConceptCodeId
    });
    
    console.log("response", JSON.stringify(response, null, 2))

    const items: AutocompleteItem[] = (response.conceptCodes || []).map(conceptCodes => {
    console.log("conceptCodes", conceptCodes.conceptCodeId)
      return (conceptCodes.attributes || [])
        .filter((attribute) => attribute.attributeName && attribute.attributeValue)
        .reduce((mapped: { [key: string]: string }, attribute: Attribute) => {
          const key = attribute.attributeName!!;
          const value = (attribute.attributeValue || []).join(",");
          mapped[key] = value;
          return mapped;
        }, { id: conceptCodes.conceptCodeId!! }) as AutocompleteItem;
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
    const { field, onError } = this.props;
    const { autocomplete } = field;

    if (!autocomplete) {
      onError("Autocomplete not configured");
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
   * Equality check between option and value
   * 
   * @param option option
   * @param value value
   * 
   * @returns boolean representing whether a option is equal to a value
   */
    private getOptionSelected = (option: AutocompleteItem, value: AutocompleteItem) => {
      return option.id === value.id;
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

  /**
   * Event handler for autocomplete input change
   * 
   * @param _event event
   * @param newInputValue new input value
   */
  private onAutocompleteInputChange = (_event: React.ChangeEvent<{}>, newInputValue: string) => {
    this.setState({
      inputValue: newInputValue
    });
  }
}
