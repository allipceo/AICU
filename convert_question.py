import pandas as pd
import re
import sys

try:
    import openpyxl
except ImportError:
    print("[오류] openpyxl이 설치되어 있지 않습니다. 아래 명령어를 먼저 실행하세요:\npip install openpyxl")
    sys.exit(1)

def process_question(text):
    # 1. 모든 줄바꿈/공백을 한 칸으로 정리
    text = ' '.join(str(text).split())
    # 2. 번호 패턴(①, 1), 1. 등) 앞에 줄바꿈 삽입
    text = re.sub(r'(①|②|③|④|⑤)', r'\n\1', text)
    text = re.sub(r'(?<!\d)([1-5])\)', r'\n\1)', text)
    text = re.sub(r'(?<!\d)([1-5])\.', r'\n\1.', text)
    text = re.sub(r'(?<!\d)([1-5])(?=\s|$)', r'\n\1', text)
    text = text.lstrip('\n')
    # 3. 줄 단위로 분리
    lines = text.split('\n')
    # 4. 문제(번호 없는 첫 줄), 보기(번호로 시작하는 줄) 분리
    question_line = None
    choice_lines = []
    for line in lines:
        if re.match(r'^(①|②|③|④|⑤|[1-5][.)]?\s*)', line):
            choice_lines.append(line.strip())
        elif question_line is None:
            question_line = line.strip()
    # 5. 보기 번호 통일(①, ②, ③, ④), ⑤ 이상은 삭제
    new_choices = []
    new_symbols = ['①', '②', '③', '④']
    for idx, line in enumerate(choice_lines):
        if idx >= 4:
            break
        # 번호 제거
        content = re.sub(r'^(①|②|③|④|⑤|[1-5][.)]?\s*)', '', line).strip()
        new_choices.append(f"{new_symbols[idx]} {content}")
    # 6. 문제+보기 합치기
    result = []
    if question_line:
        result.append(question_line)
    result.extend(new_choices)
    return '\n'.join(result)

def remove_exam_scan_artifacts(text):
    keyword = "손해보험중개사시험"
    idx = text.find(keyword)
    if idx != -1:
        return text[:idx].strip()
    return text

if __name__ == "__main__":
    try:
        df = pd.read_excel('ACIU_MASTER_01.xlsx')
    except Exception as e:
        print(f"[오류] 엑셀 파일을 읽는 중 문제가 발생했습니다: {e}")
        sys.exit(1)
    if 'QUESTION' not in df.columns:
        print("[오류] 'QUESTION' 열이 엑셀 파일에 없습니다.")
        sys.exit(1)
    df['QUESTION'] = df['QUESTION'].apply(process_question)
    df['QUESTION'] = df['QUESTION'].apply(remove_exam_scan_artifacts)
    try:
        df.to_excel('ACIU_MASTER_01_QUESTION_최종정리본.xlsx', index=False)
        print("변환 완료! 새 파일: ACIU_MASTER_01_QUESTION_최종정리본.xlsx")
    except Exception as e:
        print(f"[오류] 엑셀 파일 저장 중 문제가 발생했습니다: {e}")