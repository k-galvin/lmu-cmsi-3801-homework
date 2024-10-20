module Exercises
    ( change,
      firstThenApply,
      powers,
      meaningfulLineCount,
      Shape(..),
      volume,
      surfaceArea,
      BST(Empty),
      size,
      inorder,
      insert,
      contains,
      show
    ) where

import qualified Data.Map as Map
import Data.Text (pack, unpack, replace)
import Data.List(isPrefixOf, find)
import Data.Char(isSpace)

change :: Integer -> Either String (Map.Map Integer Integer)
change amount
    | amount < 0 = Left "amount cannot be negative"
    | otherwise = Right $ changeHelper [25, 10, 5, 1] amount Map.empty
        where
          changeHelper [] remaining counts = counts
          changeHelper (d:ds) remaining counts =
            changeHelper ds newRemaining newCounts
              where
                (count, newRemaining) = remaining `divMod` d
                newCounts = Map.insert d count counts

firstThenApply :: [a] -> (a -> Bool) -> (a -> b) -> Maybe b
firstThenApply xs pred f = f <$> find pred xs

powers :: Integral a => a -> [a]
powers base = map (base^) [0..]

meaningfulLineCount :: FilePath -> IO Int
meaningfulLineCount path = do
  contents <- readFile path
  return $ length $ filter meaningfulLine $ lines contents
  where
    meaningfulLine line =
      not (all isSpace line) && not ("#" `isPrefixOf` dropWhile isSpace line)

data Shape
    = Sphere Double 
    | Box Double Double Double 
    deriving (Eq, Show) 

volume :: Shape -> Double
volume (Sphere r) = (4/3) * pi * r^3
volume (Box l w h) = l * w * h

surfaceArea :: Shape -> Double
surfaceArea (Sphere r) = 4 * pi * r^2
surfaceArea (Box l w h) = 2 * (l * w + l * h + w * h)

data BST a
    = Empty
    | Node a (BST a) (BST a)

size :: BST a -> Int
size Empty = 0
size (Node _ left right) = 1 + size left + size right

inorder :: BST a -> [a]
inorder Empty = []
inorder (Node value left right) = inorder left ++ [value] ++ inorder right

insert :: Ord a => a -> BST a -> BST a
insert value Empty = Node value Empty Empty
insert value (Node nodeValue left right)
    | value < nodeValue = Node nodeValue (insert value left) right
    | value > nodeValue = Node nodeValue left (insert value right)
    | otherwise = Node nodeValue left right

contains :: Ord a => a -> BST a -> Bool
contains _ Empty = False
contains target (Node value left right) 
    | target == value = True
    | target < value  = contains target left
    | target > value  = contains target right

instance Show a => Show (BST a) where
    show :: Show a => BST a -> String
    show Empty = "()"
    show (Node value left right) = 
        "(" ++ leftStr ++ show value ++ rightStr ++ ")"
      where
        leftStr = case left of
            Empty -> ""
            _     -> show left
        rightStr = case right of
            Empty -> ""
            _     -> show right