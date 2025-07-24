import pandas as pd

# 엑셀 파일에서 데이터프레임 읽기
xlsx = pd.read_excel('ins_master_db.xlsx')

# 저장할 컬럼만 추출 (엑셀의 컬럼 순서 그대로)
columns = ['INDEX', 'QCODE', 'SOURCE', 'LAYER1', 'LAYER2', 'LAYER3', 'TYPE', 'CODE1', 'CODE2', 'TITLE', 'QUESTION', 'INPUT', 'RESULT', 'ANSWER', '풀이회수', '정답회수', '오답회수', '오답율', 'EXPLAIN', 'ANALSYS', '1ST', '2ND', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
df = xlsx[columns]

# CSV로 저장 (utf-8, 인덱스 없이)
df.to_csv('ins_789_final_dev.csv', index=False, encoding='utf-8')

print('변환 완료: ins_789_final_dev.csv (UTF-8, 불필요 컬럼 제거)') 