import pandas as pd

# 엑셀 파일 경로와 저장할 CSV 파일 경로
excel_file = 'ins_master_db.xlsx'
csv_file = 'ins_master_db.csv'

# 엑셀 파일을 읽어서 DataFrame으로 변환
# 첫 번째 시트만 사용 (필요시 sheet_name 인자 조정)
df = pd.read_excel(excel_file)

# DataFrame을 CSV로 저장 (utf-8-sig로 인코딩, 인덱스 제외)
df.to_csv(csv_file, index=False, encoding='utf-8-sig')

print(f"변환 완료: {csv_file} (UTF-8 인코딩)") 