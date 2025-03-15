// 基本配置範本
module.exports = {
    // 使用常規提交規範配置
    extends: ['@commitlint/config-conventional'],
    
    // 自定義規則 (可選)
    rules: {
      // 'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']],
      // 'type-case': [2, 'always', 'lower-case'],
      // 'subject-max-length': [2, 'always', 50],
    }
  };
  
  // -------------------------------------------
  
  // 進階配置範本 (帶完整註釋)
  /*
  module.exports = {
    // 繼承現有的規則
    extends: ['@commitlint/config-conventional'],
    
    // 格式化程序（可選）
    formatter: '@commitlint/format',
    
    // 自定義規則
    rules: {
      // [級別, 適用條件, 值]
      // 級別: 0=關閉, 1=警告, 2=錯誤
      // 適用條件: always=始終, never=永不
      
      // 類型
      'type-enum': [
        2, 
        'always', 
        [
          'feat',     // 新功能
          'fix',      // 修復錯誤
          'docs',     // 文檔變更
          'style',    // 不影響代碼含義的變更（空格、格式化等）
          'refactor', // 代碼重構（既不是新功能也不是修復錯誤）
          'perf',     // 改進性能的代碼變更
          'test',     // 添加缺少的測試或更正現有測試
          'build',    // 影響構建系統或外部依賴的變更
          'ci',       // 對 CI 配置文件和腳本的變更
          'chore',    // 其他不修改 src 或測試文件的變更
          'revert',   // 還原先前的提交
        ]
      ],
      'type-case': [2, 'always', 'lower-case'],   // 類型必須是小寫
      'type-empty': [2, 'never'],                 // 類型不能為空
      
      // 範圍
      'scope-case': [2, 'always', 'lower-case'],  // 範圍必須是小寫
      // 'scope-enum': [2, 'always', ['component', 'api', 'config']], // 範圍必須在列表中
      
      // 主題
      'subject-case': [0, 'always', 'sentence-case'], // 主題大小寫（關閉）
      'subject-empty': [2, 'never'],                  // 主題不能為空
      'subject-full-stop': [2, 'never', '.'],         // 主題不能以句號結尾
      'subject-max-length': [2, 'always', 100],       // 主題最大長度
      
      // 正文
      'body-leading-blank': [1, 'always'],            // 正文前需要空行
      'body-max-line-length': [2, 'always', 100],     // 正文行最大長度
      
      // 尾注
      'footer-leading-blank': [1, 'always'],          // 尾注前需要空行
      'footer-max-line-length': [2, 'always', 100],   // 尾注行最大長度
    },
    
    // 忽略某些特定的提交消息（可選）
    ignores: [
      (commit) => commit.includes('WIP')  // 忽略包含 WIP 的提交
    ],
    
    // 自定義解析器（可選）
    parserPreset: {
      parserOpts: {
        headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
        headerCorrespondence: ['type', 'scope', 'subject'],
        issuePrefixes: ['#'],
        noteKeywords: ['BREAKING CHANGE'],
        revertPattern: /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
        revertCorrespondence: ['header', 'hash']
      }
    }
  };
  */
  
  // ---------------------------------------------
  
  // 自定義中文提交類型範本
  /*
  module.exports = {
    extends: [], // 不使用預設的規則
    rules: {
      'type-enum': [
        2, 
        'always', 
        [
          '新增',     // 新功能
          '修復',     // 修復錯誤
          '文檔',     // 文檔變更
          '格式',     // 不影響代碼含義的變更
          '重構',     // 代碼重構
          '優化',     // 性能優化
          '測試',     // 測試相關
          '構建',     // 構建系統相關
          '持續集成', // CI 相關
          '維護',     // 其他變更
          '回退',     // 還原先前的提交
        ]
      ],
      'type-empty': [2, 'never'],
      'subject-empty': [2, 'never'],
      'subject-max-length': [2, 'always', 100],
    }
  };
  */