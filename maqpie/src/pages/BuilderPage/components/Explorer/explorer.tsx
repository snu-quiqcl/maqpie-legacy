import { useEffect, useState } from 'react';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

const patternDir = new RegExp(import.meta.env.VITE_PATTERN_DIR);
const patternExp = new RegExp(import.meta.env.VITE_PATTERN_EXP);

interface TreeNode {
  id: string;
  name: string;
  isExperiment: boolean;
  parent: TreeNode | null;
  children?: TreeNode[] | null;
}

const rootNode: TreeNode = {
  id: './',
  name: '',
  isExperiment: false,
  parent: null,
};

const makeSubTree = (data: string[], parent: TreeNode) => {
  const filteredData = data.filter((name: string) => (
    patternDir.test(name) || patternExp.test(name)
  ));

  const children = filteredData.map((name: string) => {
    const isExperiment = patternExp.test(name);
    const children = isExperiment ? null : undefined;

    return {
      id: `${parent.id}${name}`,
      name: name,
      isExperiment: isExperiment,
      parent: parent,
      children: children,
    };
  });

  parent.children = children;
};

export default function Explorer() {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  useEffect(() => {
    initTree();
  }, []);

  const findNode = (id: string, nodes: TreeNode[] = tree): TreeNode => {
    for (const node of nodes) {
      if (node.id === id) {
        return node;
      }

      if (node.children) {
        try {
          const child = findNode(id, node.children);
          if (child) {
            return child;
          }
        } catch {
          continue;
        }
      }
    }
    
    throw new Error(`Node with id ${id} not found`);
  };

  const fetchChildren = async (parentId: string): Promise<string[]> => {
    const url = new URL('/ls/', window.location.origin);
    url.searchParams.set('directory', parentId);

    const res = await fetch(url.toString(), {
      method: 'GET',
    });
    const data = await res.json();

    return data;
  };

  const initTree = async () => {
    const data = await fetchChildren(rootNode.id);
    makeSubTree(data, rootNode);
    
    setTree(rootNode.children ?? []);
    setExpandedNodes([]);
  };

  const loadChildren = async (parent: TreeNode) => {
    const data = await fetchChildren(parent.id);
    makeSubTree(data, parent);

    setTree([...tree]);
    setExpandedNodes([...expandedNodes, parent.id]);
  };

  const handleNodeClick = (id: string) => {
    const node = findNode(id);
    if (node.children == undefined) {
      loadChildren(node);
    }
  };

  const handleNodeExpansionToggle = (id: string) => {
    if (expandedNodes.includes(id)) {
      setExpandedNodes(expandedNodes.filter((node) => node !== id));
    } else {
      setExpandedNodes([...expandedNodes, id]);
    }
  };

  const renderTree = (nodes: TreeNode[]) =>
    nodes.map((node) => (
      <TreeItem
        key={node.id}
        itemId={node.id}
        label={node.name}
      >
        {node.children ? renderTree(node.children) : null}
      </TreeItem>
    ));

  return (
    <SimpleTreeView
      expandedItems={expandedNodes}
      onItemClick={(_, itemId) => handleNodeClick(itemId)}
      onItemExpansionToggle={(_, itemId) => handleNodeExpansionToggle(itemId)}
    >
      {renderTree(tree)}
    </SimpleTreeView>
  );
}
