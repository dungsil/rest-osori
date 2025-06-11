import { type Node, type NodeType, QueryParser, type Term } from 'lucene-kit'

interface LogicalGroup<N = Node> extends Node {
  type: NodeType.LogicalGroup;
  flow: {
    type: NodeType.Conjunction
    nodes: N[]
  }[]
}

/**
 * 검색 문자열 `q`를 파싱하여 객체로 변환하는 유틸리티
 *
 * @param query 변환할 문자열
 * @param parser 검색 문자열을 객체로 변환하는 함수
 * @return 변환된 객체
 */
export function parseSearchQuery<T = Record<string, unknown>> (query: string, parser: (q: Term) => T): T {
  const q = new QueryParser(query).toAST()
  if (q.type === 'empty') {
    return {} as T
  }

  if (q.type === 'term') {
    return parser(q as Term)
  }

  if (q.type === 'logical-group') {
    const group = q as LogicalGroup
    const flow = group.flow[0] // 오소리 API는 OR 연산을 지원하지 않으므로 첫 번째 그룹만 사용

    return Object.assign(
      {},
      ...flow.nodes
        .map((n) => parser(n as Term))
    )
  }

  return {} as T
}
