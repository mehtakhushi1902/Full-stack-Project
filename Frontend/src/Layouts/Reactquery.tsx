import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

export const Reactquery = () => {
    const [ref, inView] = useInView();

    const fetchData = async ({ pageParam = 1 }: { pageParam: number }) => {
        const response = await fetch('https://api.pexels.com/v1/curated?page=' + pageParam + '&per_page=15', {
            method: 'GET',
            headers: {
                Authorization: 'k6uQlf3At82kQIJTX1n8N79Qn9pBLGMtnsyNR8Y4kuaacx8bSB6BGppb'
            }
        });
        const data = await response.json();
        return data;
    };

    const {
        data,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ["photos"],
        queryFn: fetchData,

        initialPageParam: 1,

        getNextPageParam: (lastPage) => {
            if (!lastPage.next_page) {
                return undefined;
            }
            return lastPage.page + 1;
        },
    });


    const photos =
        data?.pages.flatMap((page) => page.photos) ?? [];


    useEffect(() => {
        if (inView) fetchNextPage();
    }, [fetchNextPage, inView]);

    return (
        <div className="flex flex-col justify-center items-center w-full max-w-5xl lg:max-w-full">
            {photos?.map((item: any) => (
                <Card
                    key={item.id}
                    className="flex md:flex-row flex-col md:items-end xl:justify-center xl:items-center gap-8 w-full max-w-5xl my-10"
                >
                    <CardHeader className="w-72 shrink-0">
                        <CardTitle className="text-sm">{item.photographer}</CardTitle>
                        <p className="mt-2 text-xs text-brand-gray">
                            {item.alt}
                        </p>
                    </CardHeader>

                    <CardDescription className="p-0">
                        <CardContent className="w-75 h-50 md:w-125 md:h-87.5 xl:w-160 xl:h-120 overflow-hidden rounded-lg">
                            <img
                                src={item.src.large}
                                alt={item.alt}
                                className="w-full h-full object-cover"
                            />
                        </CardContent>
                    </CardDescription>
                </Card>
            ))}
            <div ref={ref}> </div>
        </div>
    );
};
