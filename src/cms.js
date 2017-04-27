import content from "../content.json";
import {cloneElement} from 'react';

const cms = (filename) => {
    const getString = (string) => {
        if (content[filename] && content[filename][string]) return content[filename][string];
        if (content[string]) return content[string];
        return string;
    };
    const traverseJSXTree = (tree) => {
        if (tree && tree.props && tree.props.children) {
            if (typeof(tree.props.children) === "string") {
                return cloneElement(tree, {}, getString(tree.props.children));
            } else {
                if (Array.isArray(tree.props.children)) {
                    let newChildren = tree.props.children.map((child, index)=> {
                        let node;
                        if (typeof(child) === "string") {
                            node = getString(child);
                        } else {
                            node = traverseJSXTree(child);
                            if (node && !node.key){
                                node = cloneElement(node, {key: index});
                            }
                        }
                        return node;
                    });
                    return cloneElement(tree, {}, newChildren);
                }else{
                    let newChild = traverseJSXTree(tree.props.children);
                    return cloneElement(tree, {}, newChild);
                }
            }
        }
        return tree;
    };
    return traverseJSXTree;
};

export default cms;