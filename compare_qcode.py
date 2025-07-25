import pandas as pd

csv_qcodes = set(pd.read_csv('ins_789_final_dev.csv', encoding='utf-8')['QCODE'])
xlsx_qcodes = set(pd.read_excel('ins_master_db.xlsx')['QCODE'])

print('CSV QCODE 개수:', len(csv_qcodes))
print('XLSX QCODE 개수:', len(xlsx_qcodes))
print('일치 개수:', len(csv_qcodes & xlsx_qcodes))
print('CSV에만 있는 QCODE(샘플):', list(csv_qcodes - xlsx_qcodes)[:10])
print('XLSX에만 있는 QCODE(샘플):', list(xlsx_qcodes - csv_qcodes)[:10]) 