import React, { Component } from 'react';
import SearchCategories from './searchCategories.jsx';

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
      category: '',
    };

    this.stringValid = false;
    this.textFill = this.textFill.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.validateString = this.validateString.bind(this);
  }

  componentDidMount() {
    this.setState({ category: 'people' });
  }

  textFill(e) {
    this.setState({ inputValue: e.target.value });
  }

  handleSubmit(e) {
    const { inputValue, category } = this.state;
    const { getSearchResults, updateRecentSearch, recentSearchList } = this.props;

    this.validateString(inputValue);

    if (this.stringValid) {
      getSearchResults(inputValue, category);
      if (!recentSearchList.length || !recentSearchList.includes(inputValue)) {
        updateRecentSearch(inputValue);
      }
    }

    this.setState({ inputValue: '' }); // clear search bar
    this.stringValid = false;
    e.preventDefault();
  }

  /**
   * Sets this.stringValid property, checks for whitespace, alphabet, and digits. Everything else is invalid.
   * @param {*} str - input string from searchBar
   */
  validateString(str) {
    const validPatt = new RegExp(/[^\w|^\s]/, 'g');
    if (validPatt.test(str)) this.stringValid = false;
    else this.stringValid = true;
  }

  updateCategory(e) {
    this.setState({ category: e.target.value });
  }

  render() {
    const categories = ['People', 'Planets', 'Species', 'Starships', 'Vehicles'];

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <fieldset name="category_button_set">
            <input
              className="inputBars"
              type="text"
              maxLength="15"
              id="search_text_input"
              onChange={this.textFill}
              value={this.state.inputValue}
            />
            <SearchCategories categories={categories} updateCategory={this.updateCategory} />
          </fieldset>
        </form>
      </div>
    );
  }
}

export default SearchBar;
