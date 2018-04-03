import React, { Component } from 'react';
import './App.css';
import SyntaxHighlighter from "react-syntax-highlighter";
import attributesArr from "./data/attributes";
import fileDownload from "js-file-download";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attributes: [],
      description: null,
      group: null,
      groups: [],
      icon_class: null,
      identifier: null,
      name: null,
      pluralName: null,
      singleName: null,
      template: null,
      isAddingGroup: false,
      isAddingAttr: false,
      isCustomAttribute: false,
      attributesAvailable: attributesArr,
    };
  }

  handleChangeIdentifier(event) {
    event.preventDefault();

    this.setState({ identifier: event.target.value });
  }

  handleChangeName(event) {
    event.preventDefault();

    this.setState({ name: event.target.value });
  }

  handleChangeDescription(event) {
    event.preventDefault();

    this.setState({ description: event.target.value });
  }

  handleChangeIconClass(event) {
    event.preventDefault();

    this.setState({ icon_class: event.target.value });
  }

  handleChangeGroup(event) {
    event.preventDefault();

    this.setState({ group: event.target.value });
  }

  handleChangeTemplate(event) {
    event.preventDefault();

    this.setState({ template: event.target.value });
  }

  handleChangeSingleName(event) {
    event.preventDefault();

    this.setState({ singleName: event.target.value });
  }

  handleChangePluralName(event) {
    event.preventDefault();

    this.setState({ pluralName: event.target.value });
  }

  handleAddGroup(event) {
    event.preventDefault();

    this.setState({ isAddingGroup: true });
  }

  handleSaveGroup(event) {
    event.preventDefault();

    let groupName = event.target.name.value;
    let newGroup = { attribute_group_name: groupName, attributes: [] };

    this.setState({
      groups: [...this.state.groups, newGroup],
      isAddingGroup: false,
    });
  }

  handleAddGroupCancel(event) {
    event.preventDefault();

    this.setState({ isAddingGroup: false });
  }

  handleRemoveGroup(groupName) {
    if (window.confirm(`Delete the ${groupName} group?`)) {
      const newGroups = this.state.groups.filter(group => {
        if (group.attribute_group_name !== groupName) return group;
      });

      // TODO: remove the group's attributes from this.state.attributes

      this.setState({
        groups: newGroups,
        isAddingAttr: false,
        activeGroup: null,
      });
    }
  }

  handleAddAttr(groupName) {
    this.setState({
      isAddingAttr: true,
      activeGroup: groupName,
    });
  }

  handleAddAttrCancel(event) {
    event.preventDefault();

    this.setState({ isAddingAttr: false, activeGroup: null });
  }

  handleAttributeSelectChange(event) {
    event.preventDefault();

    if (event.target.value == 'custom') {
      this.setState({ isCustomAttribute : true });
    } else {
      this.setState({ isCustomAttribute : false });
    }
  }

  handleAttributeSave(event) {
    event.preventDefault();

    let newAttributeName = event.target.frontend_input.value;
    let groups = [...this.state.groups];
    let groupIndex = null;

    groups.map((group, i) => {
      if (group.attribute_group_name == this.state.activeGroup) {
        groupIndex = i;
      }
    });

    if (groupIndex !== null) {
      let group = {...groups[groupIndex]};
      let groupAttributes = group.attributes;
      groupAttributes.push(newAttributeName);
      group.attributes = groupAttributes;
      groups[groupIndex] = group;

      const attributesAvailable = this.state.attributesAvailable.filter((attribute) => {
        if (attribute !== newAttributeName) return attribute;
      });

      this.setState({
        groups,
        isAddingAttr: false,
        activeGroup: null,
        attributes: [...this.state.attributes, newAttributeName],
        attributesAvailable: attributesAvailable,
       });
    } else {
      this.setState({ isAddingAttr: false, activeGroup: null });
    }
  }

  handleJsonDownload(json) {
    fileDownload(json, `blueFoot-${Math.round(new Date().getTime() / 1000)}.json`);
  }

  render() {
    let jsonCode = `{
  "_time": "${Math.round(new Date().getTime() / 1000)}",
  "content_blocks": [
    "identifier": ${JSON.stringify(this.state.identifier)},
    "name": ${JSON.stringify(this.state.name)},
    "content_type": "block",
    "description": ${JSON.stringify(this.state.description)},
    "url_key_prefix": null,
    "preview_field": null,
    "renderer": "core_default",
    "item_view_template": ${JSON.stringify(this.state.template)},
    "list_template": null,
    "list_item_template": null,
    "item_layout_update_xml": null,
    "list_layout_update_xml": null,
    "singular_name": ${JSON.stringify(this.state.singleName)},
    "plural_name": null,
    "include_in_sitemap": "0",
    "searchable": "0",
    "icon_class": ${JSON.stringify(this.state.icon_class)},
    "color": "#f06212",
    "show_in_page_builder": "1",
    "sort_order": "0",
    "group": ${JSON.stringify(this.state.group)},
    "attribute_data": {
      "attributes": ${JSON.stringify(this.state.attributes, null, 2)},
      "groups": ${JSON.stringify(this.state.groups, null, 2)}
    }
  ]
}`;

    let showGroups = this.state.groups.map((group, i) => {
      return <li key={i}>
          <span className="title">{group.attribute_group_name}</span> {!this.state.isAddingAttr ? <button className="button--secondary" onClick={this.handleAddAttr.bind(this, group.attribute_group_name)} type="button">
              Add Attribute
            </button> : ""}
          <button className="button--secondary button--round button--delete" onClick={this.handleRemoveGroup.bind(this, group.attribute_group_name)} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 16 16" width="16" height="16"><g className="nc-icon-wrapper" fill="#111111"><path fill="#111111" d="M14.7,1.3c-0.4-0.4-1-0.4-1.4,0L8,6.6L2.7,1.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4L6.6,8l-5.3,5.3 c-0.4,0.4-0.4,1,0,1.4C1.5,14.9,1.7,15,2,15s0.5-0.1,0.7-0.3L8,9.4l5.3,5.3c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3 c0.4-0.4,0.4-1,0-1.4L9.4,8l5.3-5.3C15.1,2.3,15.1,1.7,14.7,1.3z"></path></g></svg>
          </button>
        </li>;
    });

    let addGroupButton = !this.state.isAddingGroup ? (
      <button
        className="button--secondary"
        onClick={this.handleAddGroup.bind(this)}
        type="button"
      >
        Add Group
      </button>
    ) : null;

    let attributeOptions = this.state.attributesAvailable.map((attribute, i) => {
      return <option value={attribute}>{attribute}</option>
    });

    return <div className="App">
        <div className="bluefoot__form">
          <h2>BlueFoot BlockBuilder™</h2>
          <h3>Block Properties</h3>
          <form>
            <ul className="form-list">
              <li>
                <label>
                  Block Identifier
                  <input type="text" name="identifier" onChange={this.handleChangeIdentifier.bind(this)} placeholder="" required />
                </label>
              </li>
              <li>
                <label>
                  Block Name
                  <input type="text" name="name" onChange={this.handleChangeName.bind(this)} placeholder="" required />
                </label>
              </li>
              <li>
                <label>
                  Block Description
                  <input type="text" name="description" onChange={this.handleChangeDescription.bind(this)} placeholder="" />
                </label>
              </li>
              <li>
                <label>
                  Block Icon Class
                  <input name="icon_class" onChange={this.handleChangeIconClass.bind(this)} placeholder="" required type="text" />
                </label>
              </li>
              <li>
                <label>
                  Block Group
                  <select onChange={this.handleChangeGroup.bind(this)} required>
                    <option disabled defaultValue>
                      Select Group
                    </option>
                    <option value="general">General</option>
                    <option value="media">Media</option>
                    <option value="commerce">Commerce</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </li>
            </ul>
          </form>
          <h3>Groups</h3>
          <div>
            <ul className="group-list">{showGroups}</ul>
          </div>
          {this.state.isAddingAttr ? <form className="form--outline" onSubmit={this.handleAttributeSave.bind(this)}>
              <ul className="form-list">
                <li className="required">
                  <label>
                    Select Attribute
                    <select name="frontend_input" onChange={this.handleAttributeSelectChange.bind(this)}>
                      {attributeOptions}
                      <option value="custom">custom</option>
                    </select>
                  </label>
                </li>
                {this.state.isCustomAttribute ? <div>
                    <li className="required">
                      <label>
                        Attribute Code
                        <input type="text" name="attribute_code" required />
                      </label>
                    </li>
                    <li className="required">
                      <label>
                        Frontend Input
                        <select name="frontend_input">
                          <option>text</option>
                          <option>select</option>
                        </select>
                      </label>
                    </li>
                    <li className="required">
                      <label>
                        Frontend Label
                        <input type="text" name="frontend_label" />
                      </label>
                    </li>
                    <li>
                      <label>
                        Frontend Class
                        <input type="text" name="frontend_class" />
                      </label>
                    </li>
                    <li>
                      <label>
                        Is this attribute required?
                        <input type="checkbox" name="is_required" />
                      </label>
                    </li>
                    <li>
                      <label>
                        Note
                        <input type="text" name="note" />
                      </label>
                    </li>
                    <li>
                      <label>
                        Enable WYSIWYG?
                        <input type="checkbox" name="is_wysiwyg_enabled" />
                      </label>
                    </li>
                  </div> : null}
                <li className="actions">
                  <button className="button--secondary" onClick={this.handleAddAttrCancel.bind(this)} type="button">
                    Abort
                  </button>
                  <button className="button" type="submit">
                    Save Attribute
                  </button>
                </li>
                {/* "backend_type": "varchar", "source_model": null, "widget": null, */}
              </ul>
            </form> : null}
          {addGroupButton}
          {this.state.isAddingGroup ? <form className="form--outline" onSubmit={this.handleSaveGroup.bind(this)}>
              <ul className="form-list">
                <li>
                  <label>
                    Group Name
                    <input type="text" placeholder="" name="name" required />
                  </label>
                </li>
                <li className="actions">
                  <button className="button--secondary" type="button" onClick={this.handleAddGroupCancel.bind(this)}>
                    Abort
                  </button>
                  <button className="button" type="submit">
                    Save Group
                  </button>
                </li>
              </ul>
            </form> : null}
        </div>
        <div className="bluefoot__json">
          <h2>BlueFoot JSON</h2>
          <button className="download" type="button" onClick={this.handleJsonDownload.bind(this, jsonCode)}>
            Download JSON
          </button>
          <SyntaxHighlighter language="json" showLineNumbers>
            {jsonCode}
          </SyntaxHighlighter>
        </div>
      </div>;
  }
}

export default App;
