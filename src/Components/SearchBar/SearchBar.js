import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: ''
		}
		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
		this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	search() {
		this.props.onSearch(this.state.searchTerm);
		// console.log(this.state.searchTerm);
	}
	handleTermChange(event) {
		this.setState({searchTerm: event.target.value});
	}
	handleKeyPress(event) {
		if (event.which === 13 || event.keyCode === 13 || event.charCode === 13) {
			this.props.onSearch(this.state.searchTerm);
		}
	}
	render() {
		return (
			<div className="SearchBar">
  				<input onKeyPress={this.handleKeyPress} onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
  				<a onClick={this.search}>SEARCH</a>
			</div>
		);
	}
}

export default SearchBar;