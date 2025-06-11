// noinspection JSUnusedGlobalSymbols
import type { QueryParser } from 'lucene-kit'

import 'lucene-kit'

declare module 'lucene-kit' {
  interface Node {
    type: NodeType;
  }

  enum NodeType {
    LogicalGroup = 'logical-group',
    FieldGroup = 'field-group',
    Conjunction = 'conjunction',
    Negation = 'negation',
    Term = 'term',
    Exists = 'exists',
    Range = 'range',
    Regexp = 'regexp',
    Wildcard = 'wildcard',
    Empty = 'empty',
    Function = 'function',
    TermList = 'term-list'
  }

  interface TermLikeNode extends Node {
    type: TermLikeType;
    field: Field;
    analyzed?: boolean;
  }

  type FieldValue<T> = FieldValueValue<T> | FieldValueVariable;

  interface FieldValueValue<T> {
    type: 'value';
    value: T;
  }

  interface FieldValueVariable {
    type: 'variable';
    scoped: boolean;
    value: string;
  }

  type TermLikeType =
    NodeType.Term
    | NodeType.Regexp
    | NodeType.Range
    | NodeType.Wildcard
    | NodeType.Function
    | NodeType.TermList;
  type Field = string | null;

  interface TermList extends TermLikeNode {
    type: NodeType.TermList;
    value: FieldValue<any>[];
  }

  interface Term extends AnyDataType, TermLikeNode {
    type: NodeType.Term;
  }

  interface VariableNode extends TermLikeNode {
    value: FieldValueVariable;
  }

  interface FunctionNode extends TermLikeNode {
    type: NodeType.Function;
    name: string;
    description?: string;
    params: (Term | TermList)[];
  }

  interface AnyDataType {
    value: FieldValue<any>;
  }

  type FlatType = string | number | undefined | boolean | null | Date;

  type VariableResolverReturnType = FlatType | QueryParser;

  type VariableResolver = {
    [name: string]: ((node: VariableNode | FieldValueVariable) => VariableResolverReturnType) | VariableResolverReturnType;
  };

  type FunctionResolverReturnType<T> = FlatType | QueryParser | {
    resolved?: VariableResolverReturnType;
    data?: T;
  };

  type FunctionResolverCallBack<T> = (node: FunctionNode, data: T) => FunctionResolverReturnType<T>;

  type FunctionResolver = {
    [name: string]: FunctionResolverCallBack<any>;
  };

  interface IteratorConfig {

    maxDepth: number;

    featureEnablePrivateField: boolean;
  }
}
