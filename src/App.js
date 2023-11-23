import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { getTreeGroupDevice } from "./data";
import useTreeGroupList from "./useTreeGroupList";
import { Checkbox, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const TreeViewCustom = ({ name, value, handleCheckItem, isChecked }) => {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography>{name}</Typography>
      <Checkbox onChange={handleCheckItem} value={value} checked={isChecked} />
    </label>
  );
};

function App() {
  const classes = useStyles();
  const { data, selectedList, handleCheckItem } = useTreeGroupList(
    getTreeGroupDevice.data
  );
  const [expanded, setExpanded] = React.useState([data.id]);

  const handleToggle = (event, nodeIds) => {
    if (event.target.nodeName !== "svg") {
      return;
    }
    setExpanded(nodeIds);
  };

  console.log("selectedList", selectedList);

  const renderTree = (nodes) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <TreeViewCustom
            value={nodes.id}
            isChecked={selectedList.includes(nodes.id)}
            name={nodes.name}
            handleCheckItem={handleCheckItem}
          />
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <>
      {data && (
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={[data.id]}
          defaultExpandIcon={<ChevronRightIcon />}
          disableSelection={true}
          expanded={expanded}
          onNodeToggle={handleToggle}
        >
          {renderTree(data)}
        </TreeView>
      )}
    </>
  );
}

export default App;
