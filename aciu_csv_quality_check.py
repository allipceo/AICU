import csv
from collections import Counter

CSV_FILE = 'ACIU_31_QANDA_V1.0(0721).csv'
REPORT_FILE = 'aciu_csv_quality_report.txt'

REQUIRED_FIELDS = ['QCODE', 'SOURCE', 'TYPE', 'QUESTION', 'ANSWER']

SELECT_TYPE_ANSWERS = {'1', '2', '3', '4'}
TF_TYPE_ANSWERS = {'O', 'X'}

qcode_list = []
missing_fields = []
invalid_answer_rows = []
row_count = 0

with open(CSV_FILE, encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        row_count += 1
        # QCODE 중복 체크용
        qcode = row.get('QCODE', '').strip()
        qcode_list.append(qcode)
        # 결측치 체크
        for field in REQUIRED_FIELDS:
            if not row.get(field, '').strip():
                missing_fields.append((row_count, qcode, field))
        # ANSWER 필드 형식 체크
        qtype = row.get('TYPE', '').strip()
        ans = row.get('ANSWER', '').strip()
        if qtype == '선택형' and ans and ans not in SELECT_TYPE_ANSWERS:
            invalid_answer_rows.append((row_count, qcode, qtype, ans))
        if qtype == '진위형' and ans and ans not in TF_TYPE_ANSWERS:
            invalid_answer_rows.append((row_count, qcode, qtype, ans))

# QCODE 중복 체크
qcode_counter = Counter(qcode_list)
duplicated_qcodes = [q for q, cnt in qcode_counter.items() if cnt > 1 and q]

# 리포트 출력
with open(REPORT_FILE, 'w', encoding='utf-8') as rf:
    rf.write(f"총 문제 수: {row_count}\n")
    rf.write(f"QCODE 중복: {len(duplicated_qcodes)}개\n")
    if duplicated_qcodes:
        rf.write(f"중복 QCODE: {duplicated_qcodes}\n")
    rf.write(f"결측치: {len(missing_fields)}건\n")
    for rownum, qcode, field in missing_fields:
        rf.write(f"  - {rownum}행 QCODE={qcode} 필드={field} 결측\n")
    rf.write(f"ANSWER 필드 형식 오류: {len(invalid_answer_rows)}건\n")
    for rownum, qcode, qtype, ans in invalid_answer_rows:
        rf.write(f"  - {rownum}행 QCODE={qcode} TYPE={qtype} ANSWER={ans}\n")

print(f"총 문제 수: {row_count}")
print(f"QCODE 중복: {len(duplicated_qcodes)}개")
print(f"결측치: {len(missing_fields)}건")
print(f"ANSWER 필드 형식 오류: {len(invalid_answer_rows)}건")
print(f"상세 리포트: {REPORT_FILE}") 