import React, { Component } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { requestedAttributes } from './perceptionHelper';

class Data extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortAttr: ''
    };

    this.setSortAttr = (sortAttr) => {
      this.setState({sortAttr});
    }

    const {results} = props;
    console.log(results);

    const normalizedResults = results.map(({scores, ...rest}) => ({
      ...rest,
      scores: requestedAttributes.reduce((o, attr) => {
        o[attr] = scores[attr].summaryScore.value;
        return o;
      }, {})
    }));
    console.log('normalizedResults: ', normalizedResults);

    const resultsByUser = normalizedResults.reduce((o, {author, content, scores}) => {
      if(o[author] === undefined) {
        o[author] = [];
      }
      o[author].push({content, scores});
      return o;
    }, {});
    console.log('resultsByUser: ', resultsByUser);

    const resultsByUserArr = Object.keys(resultsByUser)
      .map((author) => ({author, results: resultsByUser[author]}));
    console.log('resultsByUserArr: ', resultsByUserArr);
    
    const resultsByAttrByUser = resultsByUserArr.map(({author, results}) => ({
      author,
      scores: results.reduce((o, {scores}) => {
        requestedAttributes.forEach((attr) => {
          if(o[attr] === undefined) o[attr] = [];
          o[attr].push(scores[attr]);
        });
        return o;
      }, {})
    }));
    console.log('resultsByUserByAttr: ', resultsByAttrByUser);
    
    const numAboveThreshold = (s, x) => s + (x > .7 ? 1 : 0);
    const resultsForTable = resultsByAttrByUser.map(({author, scores}) => ({
      author: author,
      scores: requestedAttributes.reduce((o, attr) => {
        o[attr] = scores[attr].reduce(numAboveThreshold, 0) / scores[attr].length;
        return o;
      }, {})
    }));
    console.log('resultsForTable: ', resultsForTable);

    this.resultsForTable = resultsForTable;
  }

  render() {
    const { setSortAttr } = this;
    const { sortAttr } = this.state
    let sortedTable = this.resultsForTable;
    if(sortAttr) {
      sortedTable = sortedTable.sort((a, b) => b.scores[sortAttr] - a.scores[sortAttr])
    }
    return (
      <Table>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            {
              requestedAttributes.map((attr) => {
                const prettyAttr = attr
                  .split('_')
                  .map(e => e[0].toUpperCase() + e.slice(1).toLowerCase())
                  .join(' ');
                return <TableHeaderColumn key={attr}><div onClick={() => setSortAttr(attr)}>{prettyAttr}</div></TableHeaderColumn>
              })
            }
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            sortedTable.map(({author, scores}, i) => {
              return (
                <TableRow key={author+i}>
                  <TableRowColumn>{author}</TableRowColumn>
                  <TableRowColumn>{scores.TOXICITY.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>{scores.SEVERE_TOXICITY.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>{scores.INCOHERENT.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>{scores.INFLAMMATORY.toFixed(2)}</TableRowColumn>
                  <TableRowColumn>{scores.OBSCENE.toFixed(2)}</TableRowColumn>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    )
  }
}

export default Data;
