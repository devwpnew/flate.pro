import Button from "@modules/common/components/button/button";

export default function QuestionsContent({ questions, setQuestions }) {
  return (
    <>
      <div className="mb-5">
        <Button
          className={"px-2 py-1 w-auto"}
          onClick={() => setQuestions(null)}
        >
          Назад
        </Button>
      </div>

      {questions.map((el) => {
        return (
          <div className="mb-5" key={el.textItemQuestion}>
            <div className="mb-2.5 text-xl font-bold">
              {el.textItemQuestion}
            </div>
            <div className="text-lg">{el.textItemAnswer}</div>
          </div>
        );
      })}
    </>
  );
}
